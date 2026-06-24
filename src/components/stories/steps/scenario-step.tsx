"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Loader2,
} from "lucide-react";
import type { StoryProject, Scene } from "@/types";
import { splitStoryIntoScenes } from "@/lib/prompts/scenario";

interface ScenarioStepProps {
  project: Partial<StoryProject>;
  onUpdate: (updates: Partial<StoryProject>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ScenarioStep({
  project,
  onUpdate,
  onNext,
  onBack,
}: ScenarioStepProps) {
  const [scenes, setScenes] = useState<Scene[]>(project.scenes ?? []);
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiSource, setAiSource] = useState(false);

  const sceneCount =
    (project.targetDuration ?? 45) <= 20
      ? 2
      : (project.targetDuration ?? 45) <= 35
        ? 3
        : (project.targetDuration ?? 45) <= 50
          ? 4
          : 5;

  useEffect(() => {
    if (scenes.length === 0 && project.storyText) {
      generateWithAI();
    }
  }, []);

  async function generateWithAI() {
    if (!project.storyText) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/prompts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyText: project.storyText,
          atmosphere: project.atmosphere ?? "funny",
          artStyle: project.artStyle ?? "semi_realistic",
          targetDuration: project.targetDuration ?? 45,
          sceneCount,
        }),
      });
      const data = await res.json();
      if (data.scenes && !data.fallback) {
        setScenes(data.scenes);
        setAiSource(true);
        return;
      }
    } catch {}
    const fallback = splitStoryIntoScenes(
      project.storyText,
      project.targetDuration ?? 45,
      project.atmosphere ?? "funny",
      project.artStyle ?? "semi_realistic"
    );
    setScenes(fallback);
    setAiSource(false);
    setIsLoading(false);
  }

  useEffect(() => {
    if (scenes.length > 0) setIsLoading(false);
  }, [scenes]);

  const handleRegenerate = () => generateWithAI();

  const handleNext = () => {
    onUpdate({ scenes });
    onNext();
  };

  const updateScene = (id: string, updates: Partial<Scene>) => {
    setScenes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const removeScene = (id: string) => {
    setScenes((prev) => prev.filter((s) => s.id !== id));
  };

  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);
  const totalClips = scenes.reduce((sum, s) => sum + s.clips.length, 0);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <div className="text-center">
          <p className="font-medium">AI가 시나리오를 구성하고 있어요</p>
          <p className="text-sm text-muted-foreground mt-1">
            한국어 → 영어 프롬프트 자동 변환 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">시나리오 확인</h1>
          <p className="text-muted-foreground">
            AI가 {scenes.length}개 씬으로 나눴어요
          </p>
        </div>
        <div className="flex items-center gap-2">
          {aiSource && (
            <Badge
              variant="secondary"
              className="text-xs gap-1 text-green-600"
            >
              <Sparkles className="h-3 w-3" />
              AI 생성
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerate}
            className="gap-1.5"
            disabled={isLoading}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            재구성
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Badge variant="secondary">총 {totalDuration}초</Badge>
        <Badge variant="secondary">씬 {scenes.length}개</Badge>
        <Badge variant="secondary">클립 {totalClips}개</Badge>
      </div>

      <div className="space-y-3">
        {scenes.map((scene, index) => (
          <Card key={scene.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  씬 {index + 1}
                  <Badge variant="outline" className="text-xs font-normal">
                    {scene.duration}초 · 클립 {scene.clips.length}개
                  </Badge>
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() =>
                      setExpandedPrompt(
                        expandedPrompt === scene.id ? null : scene.id
                      )
                    }
                  >
                    {expandedPrompt === scene.id ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  {scenes.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => removeScene(scene.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
              <CardDescription className="text-sm">
                {scene.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {scene.promptTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs font-normal"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              {expandedPrompt === scene.id && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    영어 프롬프트 (수정 가능)
                  </p>
                  <Textarea
                    value={scene.prompt}
                    onChange={(e) =>
                      updateScene(scene.id, { prompt: e.target.value })
                    }
                    rows={3}
                    className="text-xs font-mono resize-none"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          이전
        </Button>
        <Button onClick={handleNext} className="gap-1.5">
          레퍼런스 이미지 생성
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
