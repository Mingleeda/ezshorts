import type { Scene, Atmosphere, ArtStyle, GeneratedClip } from "@/types";
import { calculateSceneBreakdown } from "./duration";

const ATMOSPHERE_EN: Record<Atmosphere, string> = {
  funny: "humorous, comedic, lighthearted",
  scary: "dark, eerie, suspenseful, horror",
  touching: "emotional, heartwarming, sentimental",
  shocking: "dramatic, intense, surprising twist",
  calm: "peaceful, serene, gentle",
  exciting: "dynamic, energetic, thrilling",
};

const ART_STYLE_EN: Record<ArtStyle, string> = {
  semi_realistic: "semi-realistic digital art, detailed illustration with realistic proportions",
  anime: "anime style, Japanese animation aesthetic, vibrant colors",
  "3d": "3D rendered, Pixar-style, smooth shading, volumetric lighting",
  illustration: "flat illustration, clean vector art, minimalist design",
  cinematic: "cinematic photography style, dramatic lighting, shallow depth of field, 35mm film grain",
};

export function splitStoryIntoScenes(
  storyText: string,
  targetDuration: number,
  atmosphere: Atmosphere,
  artStyle: ArtStyle
): Scene[] {
  const sentences = storyText
    .split(/[.!?。\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const breakdown = calculateSceneBreakdown(targetDuration, estimateSceneCount(targetDuration));
  const sceneCount = breakdown.totalClips > 0 ? estimateSceneCount(targetDuration) : 3;

  const sceneSentences = distributeEvenly(sentences, sceneCount);
  const sceneLabels = getSceneLabels(sceneCount);

  return sceneSentences.map((group, index) => {
    const description = group.join(". ") || `장면 ${index + 1}`;
    const prompt = buildEnglishPrompt(description, atmosphere, artStyle, sceneLabels[index]);
    const tags = buildKoreanTags(description, atmosphere, artStyle);

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
      description,
      prompt,
      promptTags: tags,
      clips,
      duration: breakdown.sceneDuration,
    };
  });
}

function estimateSceneCount(targetDuration: number): number {
  if (targetDuration <= 20) return 2;
  if (targetDuration <= 35) return 3;
  if (targetDuration <= 50) return 4;
  return 5;
}

function distributeEvenly(items: string[], groups: number): string[][] {
  if (items.length === 0) {
    return Array.from({ length: groups }, (_, i) => [`장면 ${i + 1} 내용`]);
  }

  const result: string[][] = Array.from({ length: groups }, () => []);
  const perGroup = Math.max(1, Math.floor(items.length / groups));

  items.forEach((item, i) => {
    const groupIdx = Math.min(Math.floor(i / perGroup), groups - 1);
    result[groupIdx].push(item);
  });

  return result;
}

function getSceneLabels(count: number): string[] {
  if (count <= 2) return ["opening scene", "climax and ending"];
  if (count <= 3) return ["opening scene, establishing setting", "rising action and conflict", "climax and resolution"];
  if (count <= 4) return ["opening scene", "rising action", "climax", "resolution and ending"];
  return ["opening scene", "early development", "rising action", "climax", "resolution and ending"];
}

function buildEnglishPrompt(
  koreanDescription: string,
  atmosphere: Atmosphere,
  artStyle: ArtStyle,
  narrativeRole: string
): string {
  const parts = [
    ART_STYLE_EN[artStyle],
    `${ATMOSPHERE_EN[atmosphere]} mood`,
    `${narrativeRole}`,
    `vertical 9:16 aspect ratio`,
    `scene description: ${koreanDescription}`,
    `high quality, detailed, consistent style`,
  ];

  return parts.join(", ");
}

function buildKoreanTags(
  description: string,
  atmosphere: Atmosphere,
  artStyle: ArtStyle
): string[] {
  const atmosphereKr: Record<Atmosphere, string> = {
    funny: "코믹",
    scary: "공포",
    touching: "감동",
    shocking: "충격",
    calm: "잔잔",
    exciting: "신남",
  };

  const artStyleKr: Record<ArtStyle, string> = {
    semi_realistic: "반실사",
    anime: "애니",
    "3d": "3D",
    illustration: "일러스트",
    cinematic: "시네마틱",
  };

  const tags = [atmosphereKr[atmosphere], artStyleKr[artStyle], "9:16 세로형"];

  const keywords = description
    .replace(/[^가-힣a-zA-Z\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length >= 2)
    .slice(0, 3);

  return [...tags, ...keywords];
}
