import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

const execAsync = promisify(exec);

const HF_CLI =
  "/Users/sunminlee/.nvm/versions/node/v20.20.2/lib/node_modules/@higgsfield/cli/vendor/hf";

interface GenerateImageRequest {
  prompt: string;
  model?: string;
  aspectRatio?: string;
  resolution?: string;
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

export async function POST(request: NextRequest) {
  const body: GenerateImageRequest = await request.json();
  const {
    prompt,
    model = "recraft_v4_1",
    aspectRatio = "9:16",
    resolution = "1k",
  } = body;

  try {
    const safePrompt = cleanPromptForShell(prompt);

    const scriptPath = join(tmpdir(), `hf_img_${Date.now()}.sh`);
    const cmd = `${HF_CLI} generate create ${model} --prompt "${safePrompt}" --aspect_ratio "${aspectRatio}" --resolution "${resolution}" --wait --json`;
    await writeFile(scriptPath, `#!/bin/bash\n${cmd}\n`, { mode: 0o755 });

    const { stdout } = await execAsync(`bash "${scriptPath}"`, { timeout: 120000 });
    await unlink(scriptPath).catch(() => {});

    const results = JSON.parse(stdout);
    if (results.length > 0 && results[0].result_url) {
      return NextResponse.json({
        imageUrl: results[0].result_url,
        jobId: results[0].id,
        status: "completed",
      });
    }

    return NextResponse.json(
      { error: "이미지 생성 실패" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Image generation error:", error);
    const msg = error instanceof Error ? error.message : "이미지 생성 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
