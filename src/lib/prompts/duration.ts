import type { ContentType, DurationRecommendation } from "@/types";

const HIGGSFIELD_MAX_CLIP = 8;

export function getDurationRecommendations(
  textLength: number,
  contentType: ContentType
): DurationRecommendation[] {
  switch (contentType) {
    case "stories":
      return getStoryRecommendations(textLength);
    case "series":
      return [
        {
          recommended: 30,
          label: "숏",
          reason: "매일 올리는 시리즈는 짧을수록 리텐션 높음",
          sceneCount: 3,
          clipsPerScene: Math.ceil(10 / HIGGSFIELD_MAX_CLIP),
        },
        {
          recommended: 45,
          label: "추천",
          reason: "에피소드 기승전결을 담기에 적당한 길이",
          sceneCount: 4,
          clipsPerScene: Math.ceil(11 / HIGGSFIELD_MAX_CLIP),
        },
      ];
    case "ads":
      return [
        {
          recommended: 15,
          label: "추천",
          reason: "광고는 짧을수록 전환율 높음",
          sceneCount: 2,
          clipsPerScene: 1,
        },
        {
          recommended: 30,
          label: "상세",
          reason: "제품 특징을 자세히 보여줄 때",
          sceneCount: 3,
          clipsPerScene: Math.ceil(10 / HIGGSFIELD_MAX_CLIP),
        },
      ];
    case "education":
      return [
        {
          recommended: 30,
          label: "짧은 학습",
          reason: "유아 집중력에 맞는 짧은 레슨",
          sceneCount: 3,
          clipsPerScene: Math.ceil(10 / HIGGSFIELD_MAX_CLIP),
        },
        {
          recommended: 60,
          label: "추천",
          reason: "반복 학습 포함, 기억에 남는 길이",
          sceneCount: 5,
          clipsPerScene: Math.ceil(12 / HIGGSFIELD_MAX_CLIP),
        },
      ];
  }
}

function getStoryRecommendations(
  textLength: number
): DurationRecommendation[] {
  const isLong = textLength > 200;

  return [
    {
      recommended: 30,
      label: "숏",
      reason: "임팩트 있는 요약, 바이럴에 유리",
      sceneCount: 2,
      clipsPerScene: Math.ceil(15 / HIGGSFIELD_MAX_CLIP),
    },
    {
      recommended: 45,
      label: isLong ? "추천" : "추천",
      reason: isLong
        ? "이 썰은 기승전결이 있어서 45초가 몰입도 최적"
        : "기승전결을 담기에 적당한 길이",
      sceneCount: 3,
      clipsPerScene: Math.ceil(15 / HIGGSFIELD_MAX_CLIP),
    },
    {
      recommended: 60,
      label: "풀",
      reason: "디테일한 전개, YouTube Shorts 최대 길이",
      sceneCount: 4,
      clipsPerScene: Math.ceil(15 / HIGGSFIELD_MAX_CLIP),
    },
  ];
}

export function calculateClipCount(
  totalDuration: number,
  maxClipDuration: number = HIGGSFIELD_MAX_CLIP
): number {
  return Math.ceil(totalDuration / maxClipDuration);
}

export function calculateSceneBreakdown(
  totalDuration: number,
  sceneCount: number,
  maxClipDuration: number = HIGGSFIELD_MAX_CLIP
) {
  const sceneDuration = Math.floor(totalDuration / sceneCount);
  const clipsPerScene = Math.ceil(sceneDuration / maxClipDuration);
  const clipDuration = Math.floor(sceneDuration / clipsPerScene);

  return {
    sceneDuration,
    clipsPerScene,
    clipDuration,
    totalClips: sceneCount * clipsPerScene,
  };
}
