import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

const execAsync = promisify(exec);
const HF_CLI =
  "/Users/sunminlee/.nvm/versions/node/v20.20.2/lib/node_modules/@higgsfield/cli/vendor/hf";

interface TTSRequest {
  text: string;
  voiceId: string;
  model?: string;
}

export async function POST(request: NextRequest) {
  const body: TTSRequest = await request.json();
  const { text, voiceId, model = "elevenlabs" } = body;

  try {
    const safeText = text
      .replace(/[""„]/g, '"')
      .replace(/['']/g, "'")
      .replace(/"/g, '\\"')
      .replace(/`/g, "")
      .replace(/\$/g, "")
      .replace(/\n/g, " ")
      .trim();

    const scriptPath = join(tmpdir(), `hf_tts_${Date.now()}.sh`);
    const cmd = `${HF_CLI} generate create text2speech_v2 --prompt "${safeText}" --model ${model} --voice_id "${voiceId}" --voice_type preset --wait --json`;
    await writeFile(scriptPath, `#!/bin/bash\n${cmd}\n`, { mode: 0o755 });

    const { stdout } = await execAsync(`bash "${scriptPath}"`, { timeout: 60000 });
    await unlink(scriptPath).catch(() => {});

    const results = JSON.parse(stdout);
    if (results.length > 0 && results[0].result_url) {
      return NextResponse.json({
        audioUrl: results[0].result_url,
        jobId: results[0].id,
        status: "completed",
      });
    }

    return NextResponse.json({ error: "TTS 생성 실패" }, { status: 500 });
  } catch (error) {
    console.error("TTS error:", error);
    const msg = error instanceof Error ? error.message : "TTS 생성 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
