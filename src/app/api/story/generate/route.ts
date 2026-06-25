import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

const execAsync = promisify(exec);
const HF_CLI =
  "/Users/sunminlee/.nvm/versions/node/v20.20.2/lib/node_modules/@higgsfield/cli/vendor/hf";

interface GenerateStoryRequest {
  prompt: string;
}

export async function POST(request: NextRequest) {
  const body: GenerateStoryRequest = await request.json();
  const { prompt } = body;

  try {
    const safePrompt = prompt
      .replace(/"/g, '\\"')
      .replace(/`/g, "")
      .replace(/\$/g, "")
      .replace(/\n/g, "\\n");

    const scriptPath = join(tmpdir(), `hf_story_${Date.now()}.sh`);
    const cmd = `${HF_CLI} generate create llm_text --prompt "${safePrompt}" --wait --json`;
    await writeFile(scriptPath, `#!/bin/bash\n${cmd}\n`, { mode: 0o755 });

    const { stdout } = await execAsync(`bash "${scriptPath}"`, { timeout: 60000 });
    await unlink(scriptPath).catch(() => {});

    const results = JSON.parse(stdout);
    if (results.length > 0) {
      const raw = results[0].result_text ?? results[0].result_url ?? "";

      const story = raw
        .replace(/^(제목|Title|##|#|\*\*).*\n?/gm, "")
        .replace(/^[\s\n]+|[\s\n]+$/g, "")
        .trim();

      return NextResponse.json({ story, jobId: results[0].id });
    }

    return NextResponse.json({ error: "썰 생성 실패" }, { status: 500 });
  } catch (error) {
    console.error("Story generation error:", error);
    const msg = error instanceof Error ? error.message : "썰 생성 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
