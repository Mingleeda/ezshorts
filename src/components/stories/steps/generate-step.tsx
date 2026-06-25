"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ArrowRight,
  Film,
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  RefreshCw,
  Play,
} from "lucide-react";
import type { StoryProject, Scene } from "@/types";
import { buildAllEnglishPrompts } from "@/lib/prompts/scenario";
import type { WizardState } from "../stories-wizard";

interface GenerateStepProps {
  project: Partial<StoryProject>;
  onUpdate: (updates: Partial<StoryProject>) => void;
  wizardState: WizardState;
  onWizardStateUpdate: (updates: Partial<WizardState>) => void;
  onBack: () => void;
  onNext: () => void;
}

type SceneStatus = "idle" | "generating" | "completed" | "failed";

interface SceneResult {
  status: SceneStatus;
  videoUrl?: string;
  sceneImageUrl?: string;
  error?: string;
}

export function GenerateStep({
  project,
  onUpdate,
  wizardState,
  onWizardStateUpdate,
  onBack,
  onNext,
}: GenerateStepProps) {
  const [scenes, setScenes] = useState<Scene[]>(project.scenes ?? []);
  const [promptsGenerated, setPromptsGenerated] = useState(
    wizardState.promptsGenerated
  );
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null);

  const [sceneResults, setSceneResults] = useState<Record<string, SceneResult>>(
    () => {
      const initial: Record<string, SceneResult> = {};
      wizardState.generatedVideos.forEach((v) => {
        initial[v.sceneId] = {
          status: "completed",
          videoUrl: v.videoUrl,
          sceneImageUrl: v.sceneImageUrl,
        };
      });
      return initial;
    }
  );

  useEffect(() => {
    if (!promptsGenerated && scenes.length > 0) {
      generatePrompts();
    }
  }, []);

  useEffect(() => {
    const videos = Object.entries(sceneResults)
      .filter(([, r]) => r.status === "completed" && r.videoUrl)
      .map(([sceneId, r]) => ({
        sceneId,
        videoUrl: r.videoUrl!,
        sceneImageUrl: r.sceneImageUrl,
      }));
    onWizardStateUpdate({ generatedVideos: videos });
  }, [sceneResults]);

  async function generatePrompts() {
    setIsGeneratingPrompts(true);
    try {
      const koreanTexts = scenes.map((s) => s.description);
      const res = await fetch("/api/prompts/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: koreanTexts }),
      });
      const { translated } = await res.json();

      const withPrompts = buildAllEnglishPrompts(
        scenes.map((s, i) => ({ ...s, description: translated[i] || s.description })),
        project.atmosphere ?? "funny",
        project.artStyle ?? "semi_realistic"
      ).map((s, i) => ({ ...s, description: koreanTexts[i] }));

      setScenes(withPrompts);
      onUpdate({ scenes: withPrompts });
    } catch {
      const withPrompts = buildAllEnglishPrompts(
        scenes,
        project.atmosphere ?? "funny",
        project.artStyle ?? "semi_realistic"
      );
      setScenes(withPrompts);
    }
    setPromptsGenerated(true);
    setIsGeneratingPrompts(false);
    onWizardStateUpdate({ promptsGenerated: true });
  }

  async function generateScene(sceneId: string) {
    const scene = scenes.find((s) => s.id === sceneId);
    if (!scene) return;

    setSceneResults((prev) => ({
      ...prev,
      [sceneId]: { status: "generating" },
    }));

    try {
      const res = await fetch("/api/videos/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: scene.prompt,
          referenceUploadId: wizardState.referenceUploadId || undefined,
          model: "kling3_0_turbo",
          aspectRatio: "9:16",
          duration: Math.min(scene.duration, 10),
        }),
      });
      const data = await res.json();

      setSceneResults((prev) => ({
        ...prev,
        [sceneId]: {
          status: data.videoUrl ? "completed" : "failed",
          videoUrl: data.videoUrl,
          sceneImageUrl: data.sceneImageUrl,
          error: data.error,
        },
      }));
    } catch {
      setSceneResults((prev) => ({
        ...prev,
        [sceneId]: { status: "failed", error: "네트워크 에러" },
      }));
    }
  }

  async function generateAll() {
    for (const scene of scenes) {
      if (sceneResults[scene.id]?.status !== "completed") {
        await generateScene(scene.id);
      }
    }
  }

  const completedCount = Object.values(sceneResults).filter(
    (r) => r.status === "completed"
  ).length;
  const isAnyGenerating = Object.values(sceneResults).some(
    (r) => r.status === "generating"
  );
  const allDone = completedCount === scenes.length && scenes.length > 0;

  if (isGeneratingPrompts) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="text-center">
          <p className="font-medium">영어 프롬프트를 생성하고 있어요</p>
          <p className="text-sm text-muted-foreground mt-1">한국어 → 영어 번역 + 프롬프트 구성 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">영상 생성</h1>
          <p className="text-muted-foreground">
            씬별로 개별 생성하거나 전체 생성할 수 있습니다
          </p>
        </div>
        <Button
          size="sm"
          onClick={generateAll}
          disabled={isAnyGenerating || allDone}
          className="gap-1.5"
        >
          {isAnyGenerating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Film className="h-3.5 w-3.5" />
          )}
          {isAnyGenerating
            ? "생성 중..."
            : allDone
              ? "전체 완료"
              : "전체 생성"}
        </Button>
      </div>

      {isAnyGenerating && (
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              <div>
                <p className="text-sm font-medium">영상 생성 중...</p>
                <p className="text-xs text-muted-foreground">
                  씬 이미지 생성 → 영상 변환 · 씬당 2~4분 소요 · 완료: {completedCount}/{scenes.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {scenes.map((scene, index) => {
          const result = sceneResults[scene.id];
          const status = result?.status ?? "idle";

          return (
            <Card key={scene.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm">씬 {index + 1}</CardTitle>
                    <Badge variant="outline" className="text-[10px]">
                      {scene.duration}초
                    </Badge>
                    {status === "generating" && (
                      <Badge className="text-[10px] gap-1 bg-blue-500">
                        <Loader2 className="h-2.5 w-2.5 animate-spin" />
                        생성 중
                      </Badge>
                    )}
                    {status === "completed" && (
                      <Badge className="text-[10px] gap-1 bg-green-500">
                        <Check className="h-2.5 w-2.5" />
                        완료
                      </Badge>
                    )}
                    {status === "failed" && (
                      <Badge variant="destructive" className="text-[10px]">
                        실패
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() =>
                        setExpandedPrompt(expandedPrompt === scene.id ? null : scene.id)
                      }
                    >
                      {expandedPrompt === scene.id ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <p className="text-xs text-muted-foreground">{scene.description}</p>

                <div className="flex flex-wrap gap-1">
                  {scene.promptTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px] font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {expandedPrompt === scene.id && (
                  <Textarea
                    value={scene.prompt}
                    onChange={(e) =>
                      setScenes((prev) =>
                        prev.map((s) =>
                          s.id === scene.id ? { ...s, prompt: e.target.value } : s
                        )
                      )
                    }
                    rows={3}
                    className="text-xs font-mono resize-none"
                  />
                )}

                {result?.videoUrl && (
                  <video
                    src={result.videoUrl}
                    controls
                    className="w-full rounded-lg max-h-64 bg-black"
                  />
                )}

                {result?.error && (
                  <p className="text-xs text-destructive">{result.error}</p>
                )}

                <div className="flex gap-2">
                  {status === "idle" && (
                    <Button
                      size="sm"
                      className="text-xs h-7 gap-1"
                      onClick={() => generateScene(scene.id)}
                      disabled={isAnyGenerating}
                    >
                      <Play className="h-3 w-3" />
                      생성
                    </Button>
                  )}
                  {(status === "completed" || status === "failed") && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7 gap-1"
                      onClick={() => generateScene(scene.id)}
                      disabled={isAnyGenerating}
                    >
                      <RefreshCw className="h-3 w-3" />
                      재생성
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          이전
        </Button>
        {allDone && (
          <Button onClick={onNext} className="gap-1.5">
            합성 & 편집으로
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
