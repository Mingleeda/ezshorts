import { NextRequest, NextResponse } from "next/server";
import type { Atmosphere, ArtStyle, Scene, GeneratedClip } from "@/types";
import {
  buildSystemPrompt,
  buildSceneGenerationPrompt,
} from "@/lib/prompts/templates";
import { calculateSceneBreakdown } from "@/lib/prompts/duration";

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

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured", fallback: true },
      { status: 200 }
    );
  }

  const systemPrompt = buildSystemPrompt("stories");
  const userPrompt = buildSceneGenerationPrompt(
    storyText,
    atmosphere,
    artStyle,
    targetDuration,
    sceneCount
  );

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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", errorText);
      return NextResponse.json(
        { error: "AI API error", fallback: true },
        { status: 200 }
      );
    }

    const data = await response.json();
    const content = data.content?.[0]?.text ?? "";

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse AI response", fallback: true },
        { status: 200 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const breakdown = calculateSceneBreakdown(targetDuration, sceneCount);

    const scenes: Scene[] = parsed.scenes.map(
      (s: { description: string; prompt: string; tags: string[]; duration: number }, index: number) => {
        const clips: GeneratedClip[] = Array.from(
          { length: breakdown.clipsPerScene },
          (_, clipIdx) => ({
            id: `clip-${index}-${clipIdx}`,
            sceneId: `scene-${index}`,
            order: clipIdx,
            duration: breakdown.clipDuration,
            status: "pending" as const,
          })
        );

        return {
          id: `scene-${index}`,
          order: index,
          description: s.description,
          prompt: s.prompt,
          promptTags: s.tags,
          clips,
          duration: s.duration || breakdown.sceneDuration,
        };
      }
    );

    return NextResponse.json({ scenes, source: "ai" });
  } catch (error) {
    console.error("Prompt generation error:", error);
    return NextResponse.json(
      { error: "Generation failed", fallback: true },
      { status: 200 }
    );
  }
}
