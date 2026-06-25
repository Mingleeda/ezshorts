import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import type { Atmosphere, ArtStyle, Scene, GeneratedClip } from "@/types";
import { calculateSceneBreakdown } from "@/lib/prompts/duration";

const execAsync = promisify(exec);
const HF_CLI =
  "/Users/sunminlee/.nvm/versions/node/v20.20.2/lib/node_modules/@higgsfield/cli/vendor/hf";

interface GenerateRequest {
  storyText: string;
  atmosphere: Atmosphere;
  artStyle: ArtStyle;
  targetDuration: number;
  sceneCount: number;
}

export async function POST(request: NextRequest) {
  const body: GenerateRequest = await request.json();
  const { storyText, atmosphere, artStyle, targetDuration, sceneCount } = body;

  const systemPrompt = `You are a video scenario writer. Split the given Korean story into exactly ${sceneCount} scenes for a ${targetDuration}-second short video. Each scene should represent a distinct narrative moment. Respond ONLY in this JSON format, no other text:
{"scenes":[{"description":"한국어 씬 설명","duration":number}]}
Rules:
- descriptions in Korean
- durations should sum to ${targetDuration}
- climax scenes get more time
- opening/ending scenes get less time
- each scene min 3 seconds, max 20 seconds`;

  const userPrompt = `다음 썰을 ${sceneCount}개 씬으로 나눠줘. 기승전결에 맞게 자연스럽게 나누고, 각 씬의 적절한 영상 길이(초)를 정해줘:\n\n${storyText}`;

  try {
    const fullPrompt = `${systemPrompt}\n\nUser: ${userPrompt}`.replace(/"/g, '\\"').replace(/`/g, "\\`").replace(/\$/g, "\\$");

    const cmd = `${HF_CLI} generate create llm_text --prompt "${fullPrompt}" --wait --json`;
    const { stdout } = await execAsync(cmd, { timeout: 60000 });
    const results = JSON.parse(stdout);

    if (results.length > 0) {
      const llmOutput = results[0].result_text || results[0].result_url || "";
      const jsonMatch = llmOutput.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const scenes: Scene[] = parsed.scenes.map(
          (s: { description: string; duration: number }, index: number) => {
            const dur = s.duration || Math.floor(targetDuration / sceneCount);
            const clipsPerScene = Math.max(1, Math.ceil(dur / 8));
            const clips: GeneratedClip[] = Array.from(
              { length: clipsPerScene },
              (_, clipIdx) => ({
                id: `clip-${index}-${clipIdx}`,
                sceneId: `scene-${index}`,
                order: clipIdx,
                duration: Math.floor(dur / clipsPerScene),
                status: "pending" as const,
              })
            );
            return {
              id: `scene-${index}`,
              order: index,
              description: s.description,
              prompt: "",
              promptTags: [],
              clips,
              duration: dur,
            };
          }
        );
        return NextResponse.json({ scenes, source: "ai" });
      }
    }
  } catch (error) {
    console.error("LLM scene generation error:", error);
  }

  // Fallback: Anthropic API
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (apiKey) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 2048,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.content?.[0]?.text ?? "";
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const scenes: Scene[] = parsed.scenes.map(
            (s: { description: string; duration: number }, index: number) => {
              const dur = s.duration || Math.floor(targetDuration / sceneCount);
              const clipsPerScene = Math.max(1, Math.ceil(dur / 8));
              const clips: GeneratedClip[] = Array.from(
                { length: clipsPerScene },
                (_, clipIdx) => ({
                  id: `clip-${index}-${clipIdx}`,
                  sceneId: `scene-${index}`,
                  order: clipIdx,
                  duration: Math.floor(dur / clipsPerScene),
                  status: "pending" as const,
                })
              );
              return {
                id: `scene-${index}`,
                order: index,
                description: s.description,
                prompt: "",
                promptTags: [],
                clips,
                duration: dur,
              };
            }
          );
          return NextResponse.json({ scenes, source: "ai" });
        }
      }
    } catch {}
  }

  return NextResponse.json({ error: "AI unavailable", fallback: true }, { status: 200 });
}
