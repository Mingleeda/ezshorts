"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Download,
  Film,
  Type,
  Music,
  Mic,
  Trash2,
  GripVertical,
  Play,
} from "lucide-react";
import type { StoryProject } from "@/types";

interface ComposeStepProps {
  project: Partial<StoryProject>;
  videos: { sceneId: string; videoUrl: string }[];
  onBack: () => void;
}

export function ComposeStep({ project, videos, onBack }: ComposeStepProps) {
  const scenes = project.scenes ?? [];
  const [orderedVideos, setOrderedVideos] = useState(
    videos.map((v, i) => ({
      ...v,
      order: i,
      sceneName:
        scenes.find((s) => s.id === v.sceneId)?.description?.slice(0, 40) ??
        `씬 ${i + 1}`,
      duration:
        scenes.find((s) => s.id === v.sceneId)?.duration ?? 5,
    }))
  );
  const [transition, setTransition] = useState("fade");
  const [subtitleEnabled, setSubtitleEnabled] = useState(true);
  const [narrationEnabled, setNarrationEnabled] = useState(true);
  const [bgmEnabled, setBgmEnabled] = useState(true);

  const moveUp = (index: number) => {
    if (index === 0) return;
    setOrderedVideos((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const moveDown = (index: number) => {
    if (index >= orderedVideos.length - 1) return;
    setOrderedVideos((prev) => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  const removeClip = (index: number) => {
    setOrderedVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const totalDuration = orderedVideos.reduce(
    (sum, v) => sum + v.duration,
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">합성 & 편집</h1>
        <p className="text-muted-foreground">
          클립 순서를 조정하고 효과를 설정하세요
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Film className="h-4 w-4" />
            타임라인
            <Badge variant="secondary" className="text-xs font-normal">
              총 {totalDuration}초 · {orderedVideos.length}개 클립
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {orderedVideos.map((video, index) => (
            <div key={video.sceneId + index}>
              <div className="flex items-center gap-2 rounded-lg border p-2">
                <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0" />

                <div className="w-20 h-14 rounded bg-black shrink-0 overflow-hidden">
                  <video
                    src={video.videoUrl}
                    className="w-full h-full object-cover"
                    muted
                    onMouseEnter={(e) =>
                      (e.target as HTMLVideoElement).play()
                    }
                    onMouseLeave={(e) => {
                      const el = e.target as HTMLVideoElement;
                      el.pause();
                      el.currentTime = 0;
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">
                    씬 {index + 1}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {video.sceneName}
                  </p>
                </div>

                <Badge variant="outline" className="text-[10px] shrink-0">
                  {video.duration}초
                </Badge>

                <div className="flex flex-col gap-0.5 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={() => moveDown(index)}
                    disabled={index >= orderedVideos.length - 1}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>

                {orderedVideos.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => removeClip(index)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>

              {index < orderedVideos.length - 1 && (
                <div className="flex items-center gap-2 ml-6 my-1">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-[10px] text-muted-foreground">
                    {transition === "fade"
                      ? "페이드"
                      : transition === "cut"
                        ? "컷"
                        : "디졸브"}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Film className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium">전환 효과</span>
          </div>
          <Select value={transition} onValueChange={(v) => v && setTransition(v)}>
            <SelectTrigger className="h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cut">컷 (바로 전환)</SelectItem>
              <SelectItem value="fade">페이드</SelectItem>
              <SelectItem value="dissolve">디졸브</SelectItem>
            </SelectContent>
          </Select>
        </Card>
        <Card
          className={`p-3 cursor-pointer transition-colors ${subtitleEnabled ? "" : "opacity-50"}`}
          onClick={() => setSubtitleEnabled(!subtitleEnabled)}
        >
          <div className="flex items-center gap-2 mb-2">
            <Type className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium">자막</span>
          </div>
          <Badge variant={subtitleEnabled ? "default" : "secondary"} className="text-xs">
            {subtitleEnabled ? "ON" : "OFF"}
          </Badge>
        </Card>
        <Card
          className={`p-3 cursor-pointer transition-colors ${narrationEnabled ? "" : "opacity-50"}`}
          onClick={() => setNarrationEnabled(!narrationEnabled)}
        >
          <div className="flex items-center gap-2 mb-2">
            <Mic className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium">나레이션</span>
          </div>
          <Badge variant={narrationEnabled ? "default" : "secondary"} className="text-xs">
            {narrationEnabled ? "AI 음성" : "OFF"}
          </Badge>
        </Card>
        <Card
          className={`p-3 cursor-pointer transition-colors ${bgmEnabled ? "" : "opacity-50"}`}
          onClick={() => setBgmEnabled(!bgmEnabled)}
        >
          <div className="flex items-center gap-2 mb-2">
            <Music className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium">BGM</span>
          </div>
          <Badge variant={bgmEnabled ? "default" : "secondary"} className="text-xs">
            {bgmEnabled ? "자동 선택" : "OFF"}
          </Badge>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">미리보기 & 내보내기</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="mx-auto w-48 aspect-[9/16] rounded-lg bg-black flex items-center justify-center">
            {orderedVideos.length > 0 ? (
              <video
                src={orderedVideos[0].videoUrl}
                controls
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Play className="h-8 w-8 text-white/40" />
            )}
          </div>
          <p className="text-xs text-center text-muted-foreground">
            합성 기능은 준비 중입니다. 개별 씬을 다운로드할 수 있습니다.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Badge variant="outline">YouTube Shorts (9:16)</Badge>
            <Badge variant="outline">Instagram Reels (9:16)</Badge>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {orderedVideos.map((video, i) => (
              <Button
                key={video.sceneId}
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={async () => {
                  try {
                    const res = await fetch(video.videoUrl);
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `ezshorts_scene_${i + 1}.mp4`;
                    a.click();
                    URL.revokeObjectURL(url);
                  } catch {
                    window.open(video.videoUrl, "_blank");
                  }
                }}
              >
                <Download className="h-3.5 w-3.5" />
                씬 {i + 1} 다운로드
              </Button>
            ))}
          </div>
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
