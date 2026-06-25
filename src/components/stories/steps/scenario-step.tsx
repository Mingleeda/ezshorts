"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Trash2,
  Loader2,
  Pencil,
  Check,
  Clock,
  Lightbulb,
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
  const [editingScene, setEditingScene] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const targetDuration = project.targetDuration ?? 45;

  useEffect(() => {
    if (scenes.length === 0 && project.storyText) {
      generateScenes();
    }
  }, []);

  async function generateScenes() {
    if (!project.storyText) return;
    setIsLoading(true);

    const sceneCount =
      targetDuration <= 20 ? 2 : targetDuration <= 35 ? 3 : targetDuration <= 50 ? 4 : 5;

    try {
      const res = await fetch("/api/prompts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyText: project.storyText,
          atmosphere: project.atmosphere ?? "funny",
          artStyle: project.artStyle ?? "semi_realistic",
          targetDuration,
          sceneCount,
        }),
      });
      const data = await res.json();
      if (data.scenes && !data.fallback) {
        const scenesWithoutPrompts = data.scenes.map((s: Scene) => ({
          ...s,
          prompt: "",
          promptTags: [],
        }));
        setScenes(scenesWithoutPrompts);
        setIsLoading(false);
        return;
      }
    } catch {}

    const fallback = splitStoryIntoScenes(
      project.storyText,
      targetDuration,
      project.atmosphere ?? "funny",
      project.artStyle ?? "semi_realistic"
    );
    setScenes(fallback);
    setIsLoading(false);
  }

  const startEdit = (scene: Scene) => {
    setEditingScene(scene.id);
    setEditText(scene.description);
  };

  const saveEdit = (sceneId: string) => {
    setScenes((prev) =>
      prev.map((s) =>
        s.id === sceneId ? { ...s, description: editText } : s
      )
    );
    setEditingScene(null);
  };

  const updateDuration = (sceneId: string, newDuration: number) => {
    const clamped = Math.max(3, Math.min(30, newDuration));
    setScenes((prev) =>
      prev.map((s) =>
        s.id === sceneId ? { ...s, duration: clamped } : s
      )
    );
  };

  const removeScene = (id: string) => {
    setScenes((prev) => prev.filter((s) => s.id !== id));
  };

  const handleNext = () => {
    onUpdate({ scenes });
    onNext();
  };

  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);
  const durationDiff = totalDuration - targetDuration;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <div className="text-center">
          <p className="font-medium">AI가 썰의 맥락을 분석하고 있어요</p>
          <p className="text-sm text-muted-foreground mt-1">
            기승전결에 맞게 씬을 나누는 중...
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
            맥락에 맞게 {scenes.length}개 씬으로 나눴어요
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={generateScenes}
          className="gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          재구성
        </Button>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" />
          총 {totalDuration}초
        </Badge>
        <Badge variant="secondary">씬 {scenes.length}개</Badge>
        {durationDiff !== 0 && (
          <Badge
            variant={Math.abs(durationDiff) > 5 ? "destructive" : "outline"}
            className="text-xs"
          >
            목표 {targetDuration}초 대비 {durationDiff > 0 ? `+${durationDiff}` : durationDiff}초
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        {scenes.map((scene, index) => {
          const role =
            index === 0
              ? "도입"
              : index === scenes.length - 1
                ? "결말"
                : index >= Math.floor(scenes.length * 0.6)
                  ? "클라이맥스"
                  : "전개";

          return (
            <Card key={scene.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm">씬 {index + 1}</CardTitle>
                    <Badge variant="outline" className="text-[10px]">
                      {role}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    {editingScene !== scene.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => startEdit(scene)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    )}
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
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {editingScene === scene.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                      className="text-sm resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => setEditingScene(null)}
                      >
                        취소
                      </Button>
                      <Button
                        size="sm"
                        className="text-xs h-7 gap-1"
                        onClick={() => saveEdit(scene.id)}
                      >
                        <Check className="h-3 w-3" />
                        저장
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {scene.description}
                  </p>
                )}

                <div className="flex items-center gap-3 pt-1">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="range"
                      min={3}
                      max={30}
                      value={scene.duration}
                      onChange={(e) =>
                        updateDuration(scene.id, parseInt(e.target.value))
                      }
                      className="flex-1 h-1.5 accent-primary cursor-pointer"
                    />
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min={3}
                        max={30}
                        value={scene.duration}
                        onChange={(e) =>
                          updateDuration(scene.id, parseInt(e.target.value) || 5)
                        }
                        className="w-14 h-7 text-xs text-center"
                      />
                      <span className="text-xs text-muted-foreground">초</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground flex items-start gap-2">
        <Lightbulb className="h-3.5 w-3.5 shrink-0 mt-0.5" />
        <div>
          <p>AI가 씬의 역할(도입/전개/클라이맥스/결말)에 따라 길이를 추천했어요.</p>
          <p className="mt-1">슬라이더로 씬별 길이를 자유롭게 조절할 수 있습니다. 확인 후 다음 단계에서 영어 프롬프트가 자동 생성됩니다.</p>
        </div>
      </div>

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
