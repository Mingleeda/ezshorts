"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Lightbulb } from "lucide-react";
import type { StoryProject, ArtStyle } from "@/types";
import { DurationSelector } from "@/components/shared/duration-selector";

const artStyles: { value: ArtStyle; label: string; description: string }[] = [
  { value: "semi_realistic", label: "반실사", description: "실사와 그림의 중간" },
  { value: "anime", label: "애니메이션", description: "일본 애니 스타일" },
  { value: "3d", label: "3D 렌더링", description: "3D 캐릭터/배경" },
  { value: "illustration", label: "일러스트", description: "플랫한 그림체" },
  { value: "cinematic", label: "시네마틱", description: "영화 같은 분위기" },
];

interface MoodboardStepProps {
  project: Partial<StoryProject>;
  onUpdate: (updates: Partial<StoryProject>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function MoodboardStep({
  project,
  onUpdate,
  onNext,
  onBack,
}: MoodboardStepProps) {
  const [artStyle, setArtStyle] = useState<ArtStyle>(
    project.artStyle ?? "semi_realistic"
  );
  const [targetDuration, setTargetDuration] = useState(
    project.targetDuration ?? 45
  );

  const handleNext = () => {
    onUpdate({
      artStyle,
      targetDuration,
      moodboard: {
        atmosphere: project.atmosphere ?? "funny",
        artStyle,
      },
    });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">분위기 & 스타일</h1>
        <p className="text-muted-foreground">
          영상의 아트 스타일과 길이를 선택하세요
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">아트 스타일</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {artStyles.map((style) => (
              <div
                key={style.value}
                onClick={() => setArtStyle(style.value)}
                className={`cursor-pointer rounded-lg border-2 p-4 text-center transition-all ${
                  artStyle === style.value
                    ? "border-primary bg-primary/5"
                    : "border-transparent bg-muted/50 hover:border-border"
                }`}
              >
                <div className="h-16 rounded-md bg-gradient-to-br from-muted to-muted-foreground/20 mb-3" />
                <p className="font-medium text-sm">{style.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {style.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <DurationSelector
        storyLength={project.storyText?.length ?? 0}
        contentType="stories"
        value={targetDuration}
        onChange={setTargetDuration}
      />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          이전
        </Button>
        <Button onClick={handleNext} className="gap-1.5">
          다음
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
