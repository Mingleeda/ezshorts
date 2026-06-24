"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Loader2,
  Wand2,
  Check,
} from "lucide-react";
import type { StoryProject } from "@/types";

function buildReferencePrompt(project: Partial<StoryProject>): string {
  const storyText = project.storyText ?? "";

  const artStyleEn: Record<string, string> = {
    semi_realistic: "semi-realistic digital art, detailed and polished",
    anime: "anime style, vibrant colors, expressive",
    "3d": "3D rendered, Pixar-style, smooth shading",
    illustration: "flat illustration, clean vector art",
    cinematic: "cinematic photography, dramatic lighting, 35mm film",
  };

  const atmosphereEn: Record<string, string> = {
    funny: "humorous lighthearted mood",
    scary: "dark eerie suspenseful mood",
    touching: "emotional heartwarming mood, warm soft lighting",
    shocking: "dramatic intense mood",
    calm: "peaceful serene mood",
    exciting: "dynamic energetic mood",
  };

  const style = artStyleEn[project.artStyle ?? "semi_realistic"];
  const mood = atmosphereEn[project.atmosphere ?? "funny"];

  return `${style}, ${mood}, character reference sheet showing the main characters from this story: ${storyText.slice(0, 200)}, vertical 9:16 aspect ratio, high quality, 4K, showing character appearance and scene atmosphere, consistent style`;
}

async function generateViaAPI(prompt: string): Promise<string> {
  const res = await fetch("/api/images/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, model: "recraft_v4_1", aspectRatio: "9:16" }),
  });
  const data = await res.json();
  if (data.imageUrl) return data.imageUrl;
  throw new Error(data.error || "이미지 생성 실패");
}

interface ReferenceStepProps {
  project: Partial<StoryProject>;
  onUpdate: (updates: Partial<StoryProject>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ReferenceStep({
  project,
  onUpdate,
  onNext,
  onBack,
}: ReferenceStepProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  async function generate() {
    const prompt = buildReferencePrompt(project);
    setIsLoading(true);
    setIsApproved(false);
    setIsFailed(false);
    setImageUrl(null);
    try {
      const url = await generateViaAPI(prompt);
      setImageUrl(url);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
      setIsFailed(true);
    }
  }

  const handleNext = () => {
    onNext();
  };

  const artStyleLabels: Record<string, string> = {
    semi_realistic: "반실사", anime: "애니메이션", "3d": "3D 렌더링",
    illustration: "일러스트", cinematic: "시네마틱",
  };
  const atmosphereLabels: Record<string, string> = {
    funny: "웃긴 😂", scary: "무서운 👻", touching: "감동 🥹",
    shocking: "충격 😱", calm: "잔잔한 😌", exciting: "신나는 🔥",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">캐릭터 & 분위기 확인</h1>
          <p className="text-muted-foreground">
            주인공과 영상 톤을 미리 확인하세요
          </p>
        </div>
        <Button
          size="sm"
          onClick={generate}
          disabled={isLoading}
          className="gap-1.5"
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Wand2 className="h-3.5 w-3.5" />
          )}
          {imageUrl ? "다시 생성" : "이미지 생성"}
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Badge variant="secondary">
          {artStyleLabels[project.artStyle ?? "semi_realistic"]}
        </Badge>
        <Badge variant="secondary">
          {atmosphereLabels[project.atmosphere ?? "funny"]}
        </Badge>
        <Badge variant="secondary">
          씬 {project.scenes?.length ?? 0}개 · {project.targetDuration ?? 45}초
        </Badge>
      </div>

      <Card className="overflow-hidden">
        <div className="relative aspect-[9/16] max-w-sm mx-auto bg-muted flex items-center justify-center overflow-hidden">
          {imageUrl && !isLoading && (
            <img
              src={imageUrl}
              alt="캐릭터 & 분위기 레퍼런스"
              className="w-full h-full object-cover"
            />
          )}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted">
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-3" />
              <p className="text-sm font-medium">
                AI가 캐릭터와 분위기를 그리고 있어요
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                10~20초 소요
              </p>
            </div>
          )}
          {!imageUrl && !isLoading && (
            <button
              onClick={generate}
              className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
            >
              <Wand2 className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                클릭하여 레퍼런스 이미지 생성
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                주인공 + 분위기 확인용
              </p>
            </button>
          )}
          {isFailed && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted">
              <p className="text-sm text-destructive mb-3">생성 실패</p>
              <Button size="sm" variant="outline" onClick={generate}>
                다시 시도
              </Button>
            </div>
          )}
          {isApproved && !isLoading && (
            <div className="absolute top-3 right-3">
              <div className="rounded-full bg-primary p-1.5">
                <Check className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
          )}
        </div>
        {imageUrl && !isLoading && !isFailed && (
          <CardContent className="p-4 text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              이 캐릭터와 분위기로 영상을 만들까요?
            </p>
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={generate}
                className="gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                다른 느낌으로
              </Button>
              <Button
                size="sm"
                onClick={() => setIsApproved(true)}
                className="gap-1.5"
                variant={isApproved ? "default" : "outline"}
              >
                <Check className="h-3.5 w-3.5" />
                {isApproved ? "승인됨" : "이 느낌으로!"}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          이전
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isApproved}
          className="gap-1.5"
        >
          영상 생성으로
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
