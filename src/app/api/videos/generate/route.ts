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

async function generateSceneImageWithReference(
  prompt: string,
  referenceUploadId: string,
  aspectRatio: string
): Promise<{ imageUrl: string; uploadId: string }> {
  const safePrompt = prompt.replace(/"/g, '\\"').replace(/`/g, "\\`");

  const cmd = `${HF_CLI} generate create flux_kontext --prompt "${safePrompt}" --input_images '[{"id":"${referenceUploadId}","type":"media_input"}]' --aspect_ratio "${aspectRatio}" --wait --json`;

  const { stdout } = await execAsync(cmd, { timeout: 120000 });
  const results = JSON.parse(stdout);

  if (results.length > 0 && results[0].result_url) {
    const uploadId = await downloadAndUpload(results[0].result_url);
    return { imageUrl: results[0].result_url, uploadId };
  }
  throw new Error("Scene image generation failed");
}

async function generateSceneImageStandalone(
  prompt: string,
  aspectRatio: string
): Promise<{ imageUrl: string; uploadId: string }> {
  const safePrompt = prompt.replace(/"/g, '\\"').replace(/`/g, "\\`");
  const cmd = `${HF_CLI} generate create recraft_v4_1 --prompt "${safePrompt}" --aspect_ratio "${aspectRatio}" --resolution "1k" --wait --json`;

  const { stdout } = await execAsync(cmd, { timeout: 120000 });
  const results = JSON.parse(stdout);

  if (results.length > 0 && results[0].result_url) {
    const uploadId = await downloadAndUpload(results[0].result_url);
    return { imageUrl: results[0].result_url, uploadId };
  }
  throw new Error("Scene image generation failed");
}

export async function POST(request: NextRequest) {
  const body: GenerateVideoRequest = await request.json();
  const {
    prompt,
    referenceUploadId,
    model = "kling3_0_turbo",
    aspectRatio = "9:16",
    duration = 5,
  } = body;

  try {
    let sceneResult;
    if (referenceUploadId) {
      sceneResult = await generateSceneImageWithReference(
        prompt,
        referenceUploadId,
        aspectRatio
      );
    } else {
      sceneResult = await generateSceneImageStandalone(prompt, aspectRatio);
    }

    const safePrompt = prompt.replace(/"/g, '\\"').replace(/`/g, "\\`");
    const cmd = `${HF_CLI} generate create ${model} --prompt "${safePrompt}" --image ${sceneResult.uploadId} --aspect_ratio "${aspectRatio}" --duration ${duration} --wait --json`;

    const { stdout } = await execAsync(cmd, { timeout: 300000 });
    const results = JSON.parse(stdout);

    if (results.length > 0 && results[0].result_url) {
      return NextResponse.json({
        videoUrl: results[0].result_url,
        sceneImageUrl: sceneResult.imageUrl,
        jobId: results[0].id,
        status: "completed",
      });
    }

    return NextResponse.json(
      { error: "No video generated" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Video generation error:", error);
    return NextResponse.json(
      { error: "Video generation failed" },
      { status: 500 }
    );
  }
}
