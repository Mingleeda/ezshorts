import { NextRequest, NextResponse } from "next/server";
import type { Atmosphere, ArtStyle, Scene, GeneratedClip } from "@/types";

interface GenerateRequest {
  storyText: string;
  atmosphere: Atmosphere;
  artStyle: ArtStyle;
  targetDuration: number;
  sceneCount: number;
}

function buildScenes(
  parsed: { scenes: { description: string; duration: number }[] },
  targetDuration: number
): Scene[] {
  return parsed.scenes.map(
    (s: { description: string; duration: number }, index: number) => {
      const dur = s.duration || Math.floor(targetDuration / parsed.scenes.length);
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
}

export async function POST(request: NextRequest) {
  const body: GenerateRequest = await request.json();
  const { storyText, targetDuration, sceneCount } = body;

  const systemPrompt = `너는 유튜브 쇼츠 영상 시나리오 작가야. 주어진 썰을 정확히 ${sceneCount}개 씬으로 나눠.

반드시 아래 JSON 형식으로만 응답해. 다른 텍스트 없이:
{"scenes":[{"description":"씬 설명","duration":숫자}]}

규칙:
- description은 한국어로 작성
- 각 씬에 등장인물의 대화(큰따옴표)를 최대한 풍부하게 포함
- 대화가 핵심인 씬은 대사를 여러 줄 넣어도 됨
- 대화가 없는 씬이라도 인물의 행동, 표정, 분위기를 구체적으로 묘사
- 원본 썰의 대화를 그대로 살려서 씬에 배치
- duration 합계는 ${targetDuration}초
- 클라이맥스 씬은 길게, 도입/결말은 짧게
- 각 씬 최소 3초, 최대 20초
- 기승전결 흐름이 자연스럽게 이어져야 함`;

  const userPrompt = `다음 썰을 ${sceneCount}개 씬으로 나눠줘. 각 씬마다 등장인물의 대사를 풍부하게 넣어줘:\n\n${storyText}`;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (apiKey) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
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

      if (res.ok) {
        const data = await res.json();
        const content = data.content?.[0]?.text ?? "";
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const scenes = buildScenes(parsed, targetDuration);
          return NextResponse.json({ scenes, source: "ai" });
        }
      }
    } catch (error) {
      console.error("Anthropic scene generation error:", error);
    }
  }

  return NextResponse.json(
    { error: "AI unavailable", fallback: true },
    { status: 200 }
  );
}
