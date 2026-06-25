import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

const execAsync = promisify(exec);

const HF_CLI =
  "/Users/sunminlee/.nvm/versions/node/v20.20.2/lib/node_modules/@higgsfield/cli/vendor/hf";

interface GenerateVideoRequest {
  prompt: string;
  referenceUploadId?: string;
  model?: string;
  aspectRatio?: string;
  duration?: number;
}

async function downloadAndUpload(imageUrl: string): Promise<string> {
  const tmpPath = join(tmpdir(), `hf_scene_${Date.now()}.png`);
  const res = await fetch(imageUrl);
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(tmpPath, buffer);

  try {
    const { stdout } = await execAsync(
      `${HF_CLI} upload create "${tmpPath}" --json`,
      { timeout: 30000 }
    );
    return JSON.parse(stdout).id;
  } finally {
    await unlink(tmpPath).catch(() => {});
  }
}

function sanitizePrompt(prompt: string): string {
  return prompt
    .replace(/"/g, '\\"')
    .replace(/`/g, "\\`")
    .replace(/\$/g, "\\$");
}

async function generateSceneImage(
  prompt: string,
  referenceUploadId: string | undefined,
  aspectRatio: string
): Promise<string> {
  const noTextPrompt = `${prompt}. Absolutely no text, no subtitles, no captions, no watermark, no words, no letters anywhere in the image.`;
  const safePrompt = sanitizePrompt(noTextPrompt);

  if (referenceUploadId) {
    const charPrompt = `${safePrompt} Keep the exact same character faces, hair, clothing, and body proportions from the reference image. Only change the scene, pose, and background as described. The characters must look identical to the reference.`;
    const cmd = `${HF_CLI} generate create flux_kontext --prompt "${charPrompt}" --input_images '[{"id":"${referenceUploadId}","type":"media_input"}]' --aspect_ratio "${aspectRatio}" --wait --json`;
    const { stdout } = await execAsync(cmd, { timeout: 120000 });
    const results = JSON.parse(stdout);
    if (results.length > 0 && results[0].result_url) {
      return results[0].result_url;
    }
  }

  const cmd = `${HF_CLI} generate create recraft_v4_1 --prompt "${safePrompt}" --aspect_ratio "${aspectRatio}" --resolution "1k" --wait --json`;
  const { stdout } = await execAsync(cmd, { timeout: 120000 });
  const results = JSON.parse(stdout);
  if (results.length > 0 && results[0].result_url) {
    return results[0].result_url;
  }
  throw new Error("Scene image generation failed");
}

export async function POST(request: NextRequest) {
  const body: GenerateVideoRequest = await request.json();
  const {
    prompt,
    referenceUploadId,
    model = "seedance_2_0",
    aspectRatio = "9:16",
    duration = 5,
  } = body;

  try {
    const sceneImageUrl = await generateSceneImage(
      prompt,
      referenceUploadId,
      aspectRatio
    );

    const sceneUploadId = await downloadAndUpload(sceneImageUrl);

    const videoPrompt = sanitizePrompt(
      `${prompt}. Animate naturally with subtle motion. No text, no subtitles, no captions, no watermark. Keep exact same character identity.`
    );

    const cmd = `${HF_CLI} generate create ${model} --prompt "${videoPrompt}" --medias '[{"id":"${sceneUploadId}","type":"media_input","role":"start_image"}]' --aspect_ratio "${aspectRatio}" --duration ${duration} --mode fast --generate_audio false --wait --json`;

    const { stdout } = await execAsync(cmd, { timeout: 300000 });
    const results = JSON.parse(stdout);

    if (results.length > 0 && results[0].result_url) {
      return NextResponse.json({
        videoUrl: results[0].result_url,
        sceneImageUrl,
        jobId: results[0].id,
        status: "completed",
      });
    }

    return NextResponse.json(
      { error: "영상 생성 실패" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Video generation error:", error);
    const msg = error instanceof Error ? error.message : "영상 생성 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
