import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import { writeFile, unlink, readFile } from "fs/promises";
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

async function runHfCommand(args: string[], maxRetries = 2): Promise<string> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const scriptPath = join(tmpdir(), `hf_cmd_${Date.now()}.sh`);
    const cmd = `${HF_CLI} ${args.join(" ")}`;
    await writeFile(scriptPath, `#!/bin/bash\n${cmd}\n`, { mode: 0o755 });

    try {
      const { stdout, stderr } = await execAsync(`bash "${scriptPath}"`, {
        timeout: 300000,
      });
      if (!stdout.trim() && stderr.trim()) {
        throw new Error(stderr.trim());
      }
      return stdout;
    } catch (error) {
      await unlink(scriptPath).catch(() => {});
      const msg = error instanceof Error ? error.message : "";
      if (msg.includes("502") || msg.includes("503") || msg.includes("timeout")) {
        if (attempt < maxRetries) {
          console.log(`Retrying (${attempt + 1}/${maxRetries})...`);
          await new Promise((r) => setTimeout(r, 3000 * (attempt + 1)));
          continue;
        }
      }
      throw error;
    } finally {
      await unlink(scriptPath).catch(() => {});
    }
  }
  throw new Error("Max retries exceeded");
}

function cleanPromptForShell(prompt: string): string {
  return prompt
    .replace(/[""„]/g, '"')
    .replace(/['']/g, "'")
    .replace(/"/g, '\\"')
    .replace(/`/g, "")
    .replace(/\$/g, "")
    .replace(/\n/g, " ")
    .trim();
}

async function generateSceneImage(
  prompt: string,
  referenceUploadId: string | undefined,
  aspectRatio: string
): Promise<string> {
  const cleanPrompt = cleanPromptForShell(
    `${prompt}. No text, no subtitles, no captions, no watermark, no words, no letters.`
  );

  if (referenceUploadId) {
    const charPrompt = cleanPromptForShell(
      `${prompt}. Keep exact same character faces, hair, clothing from reference. Only change scene and action. No text, no subtitles, no watermark.`
    );
    const stdout = await runHfCommand([
      "generate", "create", "flux_kontext",
      `--prompt`, `"${charPrompt}"`,
      `--input_images`, `'[{"id":"${referenceUploadId}","type":"media_input"}]'`,
      `--aspect_ratio`, `"${aspectRatio}"`,
      `--wait`, `--json`,
    ]);
    const results = JSON.parse(stdout);
    if (results.length > 0 && results[0].result_url) {
      return results[0].result_url;
    }
  }

  const stdout = await runHfCommand([
    "generate", "create", "recraft_v4_1",
    `--prompt`, `"${cleanPrompt}"`,
    `--aspect_ratio`, `"${aspectRatio}"`,
    `--resolution`, `"1k"`,
    `--wait`, `--json`,
  ]);
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

    const videoPrompt = cleanPromptForShell(
      `${prompt}. Animate naturally with subtle motion. No text, no subtitles. Keep same character identity.`
    );

    const stdout = await runHfCommand([
      "generate", "create", model,
      `--prompt`, `"${videoPrompt}"`,
      `--image`, sceneUploadId,
      `--aspect_ratio`, `"${aspectRatio}"`,
      `--duration`, `${duration}`,
      `--mode`, `fast`,
      `--generate_audio`, `false`,
      `--wait`, `--json`,
    ]);
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
