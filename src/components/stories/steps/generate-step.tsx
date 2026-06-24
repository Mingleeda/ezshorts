"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Download,
  Film,
  Type,
  Music,
  Mic,
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  Play,
} from "lucide-react";
import type { StoryProject, Scene } from "@/types";
import { buildAllEnglishPrompts } from "@/lib/prompts/scenario";

interface GenerateStepProps {
  project: Partial<StoryProject>;
  onBack: () => void;
}

type ClipStatus = "pending" | "generating" | "completed" | "failed";

interface ClipResult {
  sceneId: string;
  clipIndex: number;
  status: ClipStatus;
  videoUrl?: string;
  error?: string;
}

export function GenerateStep({ project, onBack }: GenerateStepProps) {
  const [scenes, setScenes] = useState<Scene[]>(project.scenes ?? []);
  const [promptsGenerated, setPromptsGenerated] = useState(false);
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null);
  const [clipResults, setClipResults] = useState<ClipResult[]>([]);
  const [isGeneratingVideos, setIsGeneratingVideos] = useState(false);
  const [currentScene, setCurrentScene] = useState<number>(-1);

  useEffect(() => {
    if (!promptsGenerated && scenes.length > 0) {
      generatePrompts();
    }
  }, []);

  function generatePrompts() {
    setIsGeneratingPrompts(true);
    setTimeout(() => {
      const withPrompts = buildAllEnglishPrompts(
        scenes,
        project.atmosphere ?? "funny",
        project.artStyle ?? "semi_realistic"
      );
      setScenes(withPrompts);
      setPromptsGenerated(true);
      setIsGeneratingPrompts(false);
    }, 500);
  }

  async function generateVideoForScene(scene: Scene, sceneIdx: number) {
    setCurrentScene(sceneIdx);

    setClipResults((prev) => [
      ...prev,
      {
        sceneId: scene.id,
        clipIndex: 0,
        status: "generating",
      },
    ]);

    try {
      const res = await fetch("/api/videos/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: scene.prompt,
          model: "kling3_0_turbo",
          aspectRatio: "9:16",
          duration: Math.min(scene.duration, 10),
        }),
      });
      const data = await res.json();

      setClipResults((prev) =>
        prev.map((cr) =>
          cr.sceneId === scene.id && cr.clipIndex === 0
            ? {
                ...cr,
                status: data.videoUrl ? "completed" : "failed",
                videoUrl: data.videoUrl,
                error: data.error,
              }
            : cr
        )
      );
    } catch {
      setClipResults((prev) =>
        prev.map((cr) =>
          cr.sceneId === scene.id && cr.clipIndex === 0
            ? { ...cr, status: "failed", error: "네트워크 에러" }
            : cr
        )
      );
    }
  }

  async function generateAllVideos() {
    setIsGeneratingVideos(true);
    setClipResults([]);

    for (let i = 0; i < scenes.length; i++) {
      await generateVideoForScene(scenes[i], i);
    }

    setIsGeneratingVideos(false);
    setCurrentScene(-1);
  }

  const totalClips = scenes.reduce((sum, s) => sum + s.clips.length, 0);
  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);
  const completedClips = clipResults.filter(
    (cr) => cr.status === "completed"
  ).length;
  const allDone =
    clipResults.length > 0 &&
    clipResults.every((cr) => cr.status === "completed" || cr.status === "failed");

  if (isGeneratingPrompts) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="text-center">
          <p className="font-medium">영어 프롬프트를 생성하고 있어요</p>
          <p className="text-sm text-muted-foreground mt-1">
            한국어 시나리오 → 영어 프롬프트 자동 변환 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">영상 생성</h1>
        <p className="text-muted-foreground">
          {scenes.length}개 씬의 영어 프롬프트가 준비되었습니다
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            씬별 프롬프트
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {scenes.map((scene, index) => {
            const clip = clipResults.find((cr) => cr.sceneId === scene.id);
            return (
              <div key={scene.id} className="rounded-lg border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">씬 {index + 1}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {scene.duration}초
                    </Badge>
                    {clip?.status === "generating" && (
                      <Badge className="text-[10px] gap-1 bg-blue-500">
                        <Loader2 className="h-2.5 w-2.5 animate-spin" />
                        생성 중
                      </Badge>
                    )}
                    {clip?.status === "completed" && (
                      <Badge className="text-[10px] gap-1 bg-green-500">
                        <Check className="h-2.5 w-2.5" />
                        완료
                      </Badge>
                    )}
                    {clip?.status === "failed" && (
                      <Badge variant="destructive" className="text-[10px]">
                        실패
                      </Badge>
                    )}
                  </div>
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
                </div>
                <p className="text-xs text-muted-foreground">
                  {scene.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {scene.promptTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-[10px] font-normal"
                    >
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
                          s.id === scene.id
                            ? { ...s, prompt: e.target.value }
                            : s
                        )
                      )
                    }
                    rows={3}
                    className="text-xs font-mono resize-none mt-1"
                  />
                )}
                {clip?.videoUrl && (
                  <div className="mt-2">
                    <video
                      src={clip.videoUrl}
                      controls
                      className="w-full rounded-lg max-h-64 bg-black"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {isGeneratingVideos && (
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              <div>
                <p className="text-sm font-medium">
                  영상 생성 중... (씬 {currentScene + 1}/{scenes.length})
                </p>
                <p className="text-xs text-muted-foreground">
                  씬당 1~3분 소요 · 완료: {completedClips}/{scenes.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center">
        <Button
          size="lg"
          className="gap-2 px-8"
          onClick={generateAllVideos}
          disabled={isGeneratingVideos || !promptsGenerated}
        >
          {isGeneratingVideos ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : allDone ? (
            <Check className="h-5 w-5" />
          ) : (
            <Film className="h-5 w-5" />
          )}
          {isGeneratingVideos
            ? "생성 중..."
            : allDone
              ? "다시 생성하기"
              : "영상 생성하기"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Type className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium">자막</span>
          </div>
          <Badge variant="secondary" className="text-xs">자동 생성</Badge>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Mic className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium">나레이션</span>
          </div>
          <Badge variant="secondary" className="text-xs">AI 음성</Badge>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Music className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium">BGM</span>
          </div>
          <Badge variant="secondary" className="text-xs">자동 선택</Badge>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Film className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium">전환</span>
          </div>
          <Select defaultValue="fade">
            <SelectTrigger className="h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cut">컷</SelectItem>
              <SelectItem value="fade">페이드</SelectItem>
              <SelectItem value="dissolve">디졸브</SelectItem>
            </SelectContent>
          </Select>
        </Card>
      </div>

      {allDone && completedClips > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">내보내기</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge variant="outline">YouTube Shorts (9:16)</Badge>
              <Badge variant="outline">Instagram Reels (9:16)</Badge>
            </div>
            <div className="flex gap-2">
              {clipResults
                .filter((cr) => cr.videoUrl)
                .map((cr, i) => (
                  <a
                    key={cr.sceneId}
                    href={cr.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Download className="h-3.5 w-3.5" />
                      씬 {i + 1}
                    </Button>
                  </a>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-start">
        <Button variant="outline" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          이전
        </Button>
      </div>
    </div>
  );
}
