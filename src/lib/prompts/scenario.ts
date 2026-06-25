import type { Scene, Atmosphere, ArtStyle, GeneratedClip } from "@/types";
import { calculateSceneBreakdown } from "./duration";

export function splitStoryIntoScenes(
  storyText: string,
  targetDuration: number,
  atmosphere: Atmosphere,
  artStyle: ArtStyle
): Scene[] {
  const sceneCount = estimateSceneCount(targetDuration);
  const storyScenes = splitByContext(storyText, sceneCount);
  const durations = recommendDurations(storyScenes, targetDuration);

  return storyScenes.map((description, index) => {
    const sceneDur = durations[index];
    const clipsPerScene = Math.max(1, Math.ceil(sceneDur / HIGGSFIELD_MAX_CLIP));
    const clipDuration = Math.floor(sceneDur / clipsPerScene);

    const clips: GeneratedClip[] = Array.from(
      { length: clipsPerScene },
      (_, clipIdx) => ({
        id: `clip-${index}-${clipIdx}`,
        sceneId: `scene-${index}`,
        order: clipIdx,
        duration: clipDuration,
        status: "pending" as const,
      })
    );

    return {
      id: `scene-${index}`,
      order: index,
      description,
      prompt: "",
      promptTags: [],
      clips,
      duration: sceneDur,
    };
  });
}

const HIGGSFIELD_MAX_CLIP = 8;

type SceneRole = "opening" | "development" | "climax" | "resolution";

function classifySceneRole(index: number, total: number): SceneRole {
  if (index === 0) return "opening";
  if (index === total - 1) return "resolution";
  if (index >= Math.floor(total * 0.6)) return "climax";
  return "development";
}

function recommendDurations(scenes: string[], totalDuration: number): number[] {
  const weights = scenes.map((desc, i) => {
    const role = classifySceneRole(i, scenes.length);
    const lengthWeight = Math.min(desc.length / 50, 2.0);

    const roleWeight: Record<SceneRole, number> = {
      opening: 0.8,
      development: 1.0,
      climax: 1.3,
      resolution: 0.9,
    };

    return roleWeight[role] * (0.5 + lengthWeight * 0.5);
  });

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const rawDurations = weights.map((w) => (w / totalWeight) * totalDuration);

  const minDuration = 5;
  const durations = rawDurations.map((d) => Math.max(minDuration, Math.round(d)));

  const currentTotal = durations.reduce((a, b) => a + b, 0);
  const diff = totalDuration - currentTotal;
  if (diff !== 0) {
    const climaxIdx = scenes.length > 2 ? Math.floor(scenes.length * 0.6) : scenes.length - 1;
    durations[climaxIdx] = Math.max(minDuration, durations[climaxIdx] + diff);
  }

  return durations;
}

function estimateSceneCount(targetDuration: number): number {
  if (targetDuration <= 20) return 2;
  if (targetDuration <= 35) return 3;
  if (targetDuration <= 50) return 4;
  return 5;
}

function splitByContext(text: string, targetCount: number): string[] {
  const segments = text
    .split(/(?<=[.!?。\n])\s*/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (segments.length === 0) {
    return Array.from({ length: targetCount }, (_, i) => `장면 ${i + 1}`);
  }

  if (segments.length <= targetCount) {
    const result: string[] = [];
    for (let i = 0; i < targetCount; i++) {
      result.push(segments[i] ?? `장면 ${i + 1}`);
    }
    return result;
  }

  const contextBreaks = findContextBreaks(segments);

  if (contextBreaks.length >= targetCount - 1) {
    return groupByBreaks(segments, contextBreaks, targetCount);
  }

  return distributeByMeaning(segments, targetCount);
}

function findContextBreaks(segments: string[]): number[] {
  const breaks: number[] = [];
  const transitionWords = [
    "그런데", "근데", "그래서", "그러다", "하지만", "그러자",
    "결국", "알고보니", "그때", "갑자기", "그러더니", "그랬더니",
    "했더니", "나중에", "그 후", "그리고", "그러면서", "순간",
    "다음날", "며칠 후", "그날", "이때", "바로 그때",
  ];

  for (let i = 1; i < segments.length; i++) {
    const seg = segments[i];
    const hasTransition = transitionWords.some((w) => seg.startsWith(w));
    const hasQuoteShift =
      (segments[i - 1].includes('"') || segments[i - 1].includes("'")) !==
      (seg.includes('"') || seg.includes("'"));
    const hasLongPause = segments[i - 1].endsWith("...") || segments[i - 1].endsWith("…");

    if (hasTransition || hasQuoteShift || hasLongPause) {
      breaks.push(i);
    }
  }

  return breaks;
}

function groupByBreaks(
  segments: string[],
  breaks: number[],
  targetCount: number
): string[] {
  const selectedBreaks = selectEvenlySpaced(breaks, targetCount - 1);
  const groups: string[][] = [];
  let start = 0;

  for (const breakIdx of selectedBreaks) {
    groups.push(segments.slice(start, breakIdx));
    start = breakIdx;
  }
  groups.push(segments.slice(start));

  return groups.map((g) => g.join(" "));
}

function selectEvenlySpaced(arr: number[], count: number): number[] {
  if (arr.length <= count) return arr;
  const step = arr.length / count;
  const result: number[] = [];
  for (let i = 0; i < count; i++) {
    result.push(arr[Math.round(i * step)]);
  }
  return result;
}

function distributeByMeaning(
  segments: string[],
  targetCount: number
): string[] {
  const perGroup = Math.ceil(segments.length / targetCount);
  const result: string[] = [];

  for (let i = 0; i < targetCount; i++) {
    const start = i * perGroup;
    const end = Math.min(start + perGroup, segments.length);
    const group = segments.slice(start, end);
    if (group.length > 0) {
      result.push(group.join(" "));
    }
  }

  while (result.length < targetCount) {
    result.push(`장면 ${result.length + 1}`);
  }

  return result;
}

export function buildAllEnglishPrompts(
  scenes: Scene[],
  atmosphere: Atmosphere,
  artStyle: ArtStyle
): Scene[] {
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

  const narrativeRoles = getSceneLabels(scenes.length);

  return scenes.map((scene, index) => ({
    ...scene,
    prompt: [
      ART_STYLE_EN[artStyle],
      `${ATMOSPHERE_EN[atmosphere]} mood`,
      narrativeRoles[index],
      `scene: ${scene.description}`,
      "vertical 9:16 aspect ratio, high quality, 4K, detailed",
      "maintain exact same character identity and appearance throughout all scenes",
      "absolutely no text, no subtitles, no captions, no watermark, no words, no letters, no writing on screen",
    ].join(", "),
    promptTags: buildKoreanTags(scene.description, atmosphere, artStyle),
  }));
}

function getSceneLabels(count: number): string[] {
  if (count <= 2) return ["opening scene", "climax and ending"];
  if (count <= 3)
    return ["opening, establishing setting", "rising action and conflict", "climax and resolution"];
  if (count <= 4)
    return ["opening scene", "rising action", "climax", "resolution and ending"];
  return ["opening scene", "early development", "rising action", "climax", "resolution"];
}

function buildKoreanTags(
  description: string,
  atmosphere: Atmosphere,
  artStyle: ArtStyle
): string[] {
  const atmosphereKr: Record<Atmosphere, string> = {
    funny: "코믹", scary: "공포", touching: "감동",
    shocking: "충격", calm: "잔잔", exciting: "신남",
  };
  const artStyleKr: Record<ArtStyle, string> = {
    semi_realistic: "반실사", anime: "애니", "3d": "3D",
    illustration: "일러스트", cinematic: "시네마틱",
  };

  const tags = [atmosphereKr[atmosphere], artStyleKr[artStyle], "9:16"];
  const keywords = description
    .replace(/[^가-힣a-zA-Z\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length >= 2)
    .slice(0, 3);
  return [...tags, ...keywords];
}
