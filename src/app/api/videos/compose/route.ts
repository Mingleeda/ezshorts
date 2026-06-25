import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import { writeFile, unlink, readdir } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { createReadStream } from "fs";
import { stat } from "fs/promises";

const execAsync = promisify(exec);
const FFMPEG = "/tmp/ffmpeg";

interface ComposeRequest {
  clips: { videoUrl: string; sceneId: string }[];
  transition: "cut" | "fade" | "dissolve";
  transitionDuration?: number;
}

async function downloadFile(url: string, path: string): Promise<void> {
  const res = await fetch(url);
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(path, buffer);
}

export async function POST(request: NextRequest) {
  const body: ComposeRequest = await request.json();
  const { clips, transition = "fade", transitionDuration = 0.5 } = body;

  if (clips.length === 0) {
    return NextResponse.json({ error: "클립이 없습니다" }, { status: 400 });
  }

  const workDir = join(tmpdir(), `ezshorts_compose_${Date.now()}`);
  await execAsync(`mkdir -p "${workDir}"`);

  try {
    // Download all clips
    const localPaths: string[] = [];
    for (let i = 0; i < clips.length; i++) {
      const path = join(workDir, `clip_${i}.mp4`);
      await downloadFile(clips[i].videoUrl, path);
      localPaths.push(path);
    }

    const outputPath = join(workDir, "composed.mp4");

    if (clips.length === 1) {
      // Single clip, just copy
      await execAsync(`cp "${localPaths[0]}" "${outputPath}"`);
    } else if (transition === "cut") {
      // Simple concatenation
      const listPath = join(workDir, "list.txt");
      const listContent = localPaths.map((p) => `file '${p}'`).join("\n");
      await writeFile(listPath, listContent);
      await execAsync(
        `${FFMPEG} -f concat -safe 0 -i "${listPath}" -c copy "${outputPath}" -y`,
        { timeout: 120000 }
      );
    } else {
      // Fade/dissolve transitions using xfade filter
      if (localPaths.length === 2) {
        const probe0 = await execAsync(
          `${FFMPEG} -i "${localPaths[0]}" 2>&1 | grep Duration | awk '{print $2}' | tr -d ,`
        );
        const dur0 = parseDuration(probe0.stdout.trim());
        const offset = Math.max(0, dur0 - transitionDuration);

        await execAsync(
          `${FFMPEG} -i "${localPaths[0]}" -i "${localPaths[1]}" -filter_complex "[0:v][1:v]xfade=transition=${transition}:duration=${transitionDuration}:offset=${offset}[v];[0:a][1:a]acrossfade=d=${transitionDuration}[a]" -map "[v]" -map "[a]" "${outputPath}" -y`,
          { timeout: 120000 }
        );
      } else {
        // For 3+ clips: chain xfade filters
        let filterComplex = "";
        let currentVideo = "[0:v]";
        let currentAudio = "[0:a]";
        const inputs = localPaths.map((p) => `-i "${p}"`).join(" ");

        let accumulatedDuration = 0;
        for (let i = 0; i < localPaths.length - 1; i++) {
          const probe = await execAsync(
            `${FFMPEG} -i "${localPaths[i]}" 2>&1 | grep Duration | awk '{print $2}' | tr -d ,`
          );
          const dur = parseDuration(probe.stdout.trim());
          accumulatedDuration += dur - (i > 0 ? transitionDuration : 0);
          const offset = Math.max(0, accumulatedDuration - transitionDuration);

          const nextVideo = `[${i + 1}:v]`;
          const nextAudio = `[${i + 1}:a]`;
          const outVideo = i < localPaths.length - 2 ? `[v${i}]` : "[vout]";
          const outAudio = i < localPaths.length - 2 ? `[a${i}]` : "[aout]";

          filterComplex += `${currentVideo}${nextVideo}xfade=transition=${transition}:duration=${transitionDuration}:offset=${offset}${outVideo};`;
          filterComplex += `${currentAudio}${nextAudio}acrossfade=d=${transitionDuration}${outAudio};`;

          currentVideo = outVideo;
          currentAudio = outAudio;
        }

        filterComplex = filterComplex.slice(0, -1); // remove trailing ;

        try {
          await execAsync(
            `${FFMPEG} ${inputs} -filter_complex "${filterComplex}" -map "[vout]" -map "[aout]" "${outputPath}" -y`,
            { timeout: 180000 }
          );
        } catch {
          // Fallback: simple concat if xfade fails
          const listPath = join(workDir, "list.txt");
          const listContent = localPaths.map((p) => `file '${p}'`).join("\n");
          await writeFile(listPath, listContent);
          await execAsync(
            `${FFMPEG} -f concat -safe 0 -i "${listPath}" -c copy "${outputPath}" -y`,
            { timeout: 120000 }
          );
        }
      }
    }

    // Read the composed file and return as base64 data URL
    const fileStats = await stat(outputPath);
    const fileBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      const stream = createReadStream(outputPath);
      stream.on("data", (chunk) => chunks.push(chunk as Buffer));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", reject);
    });

    // Clean up
    await execAsync(`rm -rf "${workDir}"`).catch(() => {});

    const uint8 = new Uint8Array(fileBuffer);
    return new NextResponse(uint8, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": 'attachment; filename="ezshorts_composed.mp4"',
        "Content-Length": fileStats.size.toString(),
      },
    });
  } catch (error) {
    await execAsync(`rm -rf "${workDir}"`).catch(() => {});
    console.error("Compose error:", error);
    const msg = error instanceof Error ? error.message : "합성 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function parseDuration(timeStr: string): number {
  const parts = timeStr.split(":");
  if (parts.length !== 3) return 5;
  return (
    parseFloat(parts[0]) * 3600 +
    parseFloat(parts[1]) * 60 +
    parseFloat(parts[2])
  );
}
