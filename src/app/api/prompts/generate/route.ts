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

  const systemPrompt = `너는 유튜브 쇼츠 영상 시나리오 작가야.
주어진 썰이 간단하더라도, 기승전결이 완성된 풍부한 시나리오로 발전시켜서 정확히 ${sceneCount}개 씬으로 구성해.

반드시 아래 JSON 형식으로만 응답해. 다른 텍스트 없이:
{"scenes":[{"description":"씬 설명","duration":숫자}],"characters":["등장인물1","등장인물2"]}

시나리오 작성 규칙:
- description은 한국어로 작성
- 사용자의 원본 썰이 대화가 부족하면 자연스러운 대화를 추가로 만들어
- 각 씬에 등장인물의 대화(큰따옴표)를 최대한 풍부하게 포함
- 대화가 핵심인 씬은 대사를 여러 줄 넣어도 됨
- 대화가 없는 씬이라도 인물의 행동, 표정, 분위기를 구체적으로 묘사
- 원본 썰의 대화가 있으면 그대로 살려서 씬에 배치
- 짧은 썰이 들어와도 상황 묘사, 대화, 감정을 보강해서 완성된 시나리오로 만들어

구조 규칙:
- 기(도입): 상황/배경/인물 소개 + 도입 대화
- 승(전개): 사건 진행 + 대화로 긴장감 고조
- 전(절정): 핵심 사건/대사. 가장 극적인 순간
- 결(결말): 반응/결과. 대사나 행동으로 마무리
- duration 합계는 ${targetDuration}초
- 클라이맥스 씬은 길게, 도입/결말은 짧게
- 각 씬 최소 3초, 최대 20초

등장인물 규칙:
- characters 배열에 이 썰에 등장하는 모든 인물을 나열
- 씬에는 characters에 있는 인물만 등장시켜. 새로운 인물을 임의로 추가하지 마
- 배경 엑스트라(웨이터, 행인 등)는 "인물"로 취급하지 않으므로 괜찮음`;

  const userPrompt = `다음 썰을 ${sceneCount}개 씬의 완성된 시나리오로 만들어줘. 대화가 부족하면 자연스럽게 추가하고, 기승전결이 명확하게 이어지도록 해줘:\n\n${storyText}`;

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
