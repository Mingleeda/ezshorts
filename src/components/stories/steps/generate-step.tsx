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
  Play,
  Film,
  Type,
  Music,
  Mic,
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { StoryProject, Scene } from "@/types";
import { buildAllEnglishPrompts } from "@/lib/prompts/scenario";

interface GenerateStepProps {
  project: Partial<StoryProject>;
  onBack: () => void;
}

export function GenerateStep({ project, onBack }: GenerateStepProps) {
  const [scenes, setScenes] = useState<Scene[]>(project.scenes ?? []);
  const [promptsGenerated, setPromptsGenerated] = useState(false);
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null);

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

  const totalClips = scenes.reduce((sum, s) => sum + s.clips.length, 0);
  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);

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
            <Badge variant="secondary" className="text-xs font-normal">
              자동 생성됨
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {scenes.map((scene, index) => (
            <div key={scene.id} className="rounded-lg border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">씬 {index + 1}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {scene.duration}초 · 클립 {scene.clips.length}개
                  </Badge>
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
                  placeholder="영어 프롬프트"
                />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Film className="h-4 w-4" />
            타임라인
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {scenes.map((scene, sceneIdx) => (
              <div key={scene.id} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-10">
                    씬 {sceneIdx + 1}
                  </span>
                  <div className="flex-1 flex gap-0.5">
                    {scene.clips.map((clip, clipIdx) => (
                      <div
                        key={clip.id}
                        className="flex-1 h-10 rounded bg-muted flex items-center justify-center text-[10px] text-muted-foreground border"
                      >
                        클립 {clipIdx + 1}
                      </div>
                    ))}
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {scene.duration}초
                  </Badge>
                </div>
                {sceneIdx < scenes.length - 1 && (
                  <div className="flex items-center gap-2 ml-12">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-[10px] text-muted-foreground">
                      페이드
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t flex items-center justify-between">
            <span className="text-sm font-medium">총 {totalDuration}초</span>
            <Badge>클립 {totalClips}개</Badge>
          </div>
        </CardContent>
      </Card>

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

      <div className="flex justify-center">
        <Button size="lg" className="gap-2 px-8">
          <Film className="h-5 w-5" />
          영상 생성하기
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">내보내기</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Badge variant="outline">YouTube Shorts (9:16)</Badge>
            <Badge variant="outline">Instagram Reels (9:16)</Badge>
          </div>
          <Button disabled variant="outline" className="gap-1.5">
            <Download className="h-4 w-4" />
            다운로드
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-start">
        <Button variant="outline" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          이전
        </Button>
      </div>
    </div>
  );
}
