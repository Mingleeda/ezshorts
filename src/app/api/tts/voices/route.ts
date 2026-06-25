import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const HF_CLI =
  "/Users/sunminlee/.nvm/versions/node/v20.20.2/lib/node_modules/@higgsfield/cli/vendor/hf";

export async function GET() {
  try {
    const { stdout } = await execAsync(`${HF_CLI} voices list --json`, {
      timeout: 15000,
    });
    const data = JSON.parse(stdout);
    return NextResponse.json({ voices: data.items ?? [] });
  } catch (error) {
    console.error("Voice list error:", error);
    return NextResponse.json({ voices: [] });
  }
}
