import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const HF_CLI =
  "/Users/sunminlee/.nvm/versions/node/v20.20.2/lib/node_modules/@higgsfield/cli/vendor/hf";

interface GenerateVideoRequest {
  prompt: string;
  model?: string;
  aspectRatio?: string;
  duration?: number;
}

export async function POST(request: NextRequest) {
  const body: GenerateVideoRequest = await request.json();
  const {
    prompt,
    model = "kling3_0_turbo",
    aspectRatio = "9:16",
    duration = 5,
  } = body;

  try {
    const safePrompt = prompt.replace(/"/g, '\\"').replace(/`/g, "\\`");

    const cmd = `${HF_CLI} generate create ${model} --prompt "${safePrompt}" --aspect_ratio "${aspectRatio}" --duration ${duration} --wait --json`;

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
