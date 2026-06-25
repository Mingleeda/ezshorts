import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

const execAsync = promisify(exec);
const HF_CLI =
  "/Users/sunminlee/.nvm/versions/node/v20.20.2/lib/node_modules/@higgsfield/cli/vendor/hf";

export async function POST(request: NextRequest) {
  const { imageUrl } = await request.json();

  if (!imageUrl) {
    return NextResponse.json({ error: "imageUrl required" }, { status: 400 });
  }

  try {
    const tmpPath = join(tmpdir(), `hf_upload_${Date.now()}.png`);
    const res = await fetch(imageUrl);
    const buffer = Buffer.from(await res.arrayBuffer());
    await writeFile(tmpPath, buffer);

    try {
      const { stdout } = await execAsync(
        `${HF_CLI} upload create "${tmpPath}" --json`,
        { timeout: 30000 }
      );
      const data = JSON.parse(stdout);
      return NextResponse.json({ uploadId: data.id, url: data.url });
    } finally {
      await unlink(tmpPath).catch(() => {});
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
