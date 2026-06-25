import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

const execAsync = promisify(exec);

const HF_CLI =
  "/Users/sunminlee/.nvm/versions/node/v20.20.2/lib/node_modules/@higgsfield/cli/vendor/hf";

interface VoiceAssignment {
  characterName: string;
  voiceId: string;
  voiceName: string;
  gender: string;
}

interface GenerateVideoRequest {
  prompt: string;
  sceneDescription: string;
  referenceUploadId?: string;
  voiceAssignments?: VoiceAssignment[];
  model?: string;
  aspectRatio?: string;
  duration?: number;
}

async function downloadAndUpload(url: string, ext = "png"): Promise<string> {
  const tmpPath = join(tmpdir(), `hf_upload_${Date.now()}.${ext}`);
  const res = await fetch(url);
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

function extractDialogue(text: string): string {
  const matches = text.match(/[""“]([^""”]*)[""”]/g);
  if (!matches) return "";
  return matches
    .map((m) => m.replace(/[""“”]/g, ""))
    .join(" ");
}

async function generateTTS(
  sceneDescription: string,
  voiceAssignments: VoiceAssignment[]
): Promise<string | null> {
  const dialogue = extractDialogue(sceneDescription);
  if (!dialogue || voiceAssignments.length === 0) return null;

  const voice = voiceAssignments[0];
  for (const va of voiceAssignments) {
    const nameInScene = sceneDescription.toLowerCase().includes(va.characterName.toLowerCase());
    if (nameInScene) {
      Object.assign(voice, va);
      break;
    }
  }

  if (!voice.voiceId) return null;

  const safeText = cleanPromptForShell(dialogue);

  try {
    const stdout = await runHfCommand([
      "generate", "create", "text2speech_v2",
      `--prompt`, `"${safeText}"`,
      `--model`, `elevenlabs`,
      `--voice_id`, `"${voice.voiceId}"`,
      `--voice_type`, `preset`,
      `--wait`, `--json`,
    ]);
    const results = JSON.parse(stdout);
    if (results.length > 0 && results[0].result_url) {
      return results[0].result_url;
    }
  } catch (error) {
    console.error("TTS generation error:", error);
  }
  return null;
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
      `${prompt}. Keep exact same character faces, hair, clothing from reference. Only change scene and action. Do not add new characters that are not in the reference image unless they are background extras. No text, no subtitles, no watermark.`
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
    sceneDescription = "",
    referenceUploadId,
    voiceAssignments = [],
    model = "seedance_2_0",
    aspectRatio = "9:16",
    duration = 5,
  } = body;

  try {
    // Step 1: Generate scene image
    const sceneImageUrl = await generateSceneImage(
      prompt,
      referenceUploadId,
      aspectRatio
    );
    const sceneUploadId = await downloadAndUpload(sceneImageUrl);

    // Step 2: Generate TTS if dialogue exists
    let audioUploadId: string | null = null;
    let audioUrl: string | null = null;
    if (voiceAssignments.length > 0) {
      audioUrl = await generateTTS(sceneDescription, voiceAssignments);
      if (audioUrl) {
        audioUploadId = await downloadAndUpload(audioUrl, "mp3");
      }
    }

    // Step 3: Generate video with image + audio
    const videoPrompt = cleanPromptForShell(
      `${prompt}. Animate naturally with realistic motion. No text, no subtitles. Keep same character identity.`
    );

    const videoArgs = [
      "generate", "create", model,
      `--prompt`, `"${videoPrompt}"`,
      `--image`, sceneUploadId,
      ...(audioUploadId ? [`--audio`, audioUploadId] : []),
      `--aspect_ratio`, `"${aspectRatio}"`,
      `--duration`, `${duration}`,
      `--mode`, `fast`,
      `--generate_audio`, `true`,
      `--wait`, `--json`,
    ];

    const stdout = await runHfCommand(videoArgs);
    const results = JSON.parse(stdout);

    if (results.length > 0 && results[0].result_url) {
      return NextResponse.json({
        videoUrl: results[0].result_url,
        sceneImageUrl,
        audioUrl,
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
