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
  referenceImageUrl?: string;
  model?: string;
  aspectRatio?: string;
  duration?: number;
}

async function uploadImage(imageUrl: string): Promise<string> {
  const tmpPath = join(tmpdir(), `hf_ref_${Date.now()}.png`);

  const res = await fetch(imageUrl);
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(tmpPath, buffer);

  try {
    const { stdout } = await execAsync(
      `${HF_CLI} upload create "${tmpPath}" --json`,
      { timeout: 30000 }
    );
    const data = JSON.parse(stdout);
    return data.id;
  } finally {
    await unlink(tmpPath).catch(() => {});
  }
}

export async function POST(request: NextRequest) {
  const body: GenerateVideoRequest = await request.json();
  const {
    prompt,
    referenceImageUrl,
    model = "kling3_0_turbo",
    aspectRatio = "9:16",
    duration = 5,
  } = body;

  try {
    const safePrompt = prompt.replace(/"/g, '\\"').replace(/`/g, "\\`");
    let imageFlag = "";

    if (referenceImageUrl) {
      const uploadId = await uploadImage(referenceImageUrl);
      imageFlag = `--image ${uploadId}`;
    }

    const cmd = `${HF_CLI} generate create ${model} --prompt "${safePrompt}" ${imageFlag} --aspect_ratio "${aspectRatio}" --duration ${duration} --wait --json`;

    const { stdout } = await execAsync(cmd, { timeout: 300000 });

    const results = JSON.parse(stdout);
    if (results.length > 0 && results[0].result_url) {
      return NextResponse.json({
        videoUrl: results[0].result_url,
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
