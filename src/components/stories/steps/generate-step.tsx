"use client";

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
  Download,
  Play,
  Film,
  Type,
  Music,
  Mic,
} from "lucide-react";
import type { StoryProject } from "@/types";

interface GenerateStepProps {
  project: Partial<StoryProject>;
  onBack: () => void;
}

export function GenerateStep({ project, onBack }: GenerateStepProps) {
  const scenes = project.scenes ?? [];
  const totalClips = scenes.reduce((sum, s) => sum + s.clips.length, 0);
  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">영상 생성 & 합성</h1>
        <p className="text-muted-foreground">
          {totalClips}개 클립을 생성하고 하나의 영상으로 합성합니다
        </p>
      </div>

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
          <Badge variant="secondary" className="text-xs">
            자동 생성
          </Badge>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Mic className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium">나레이션</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            AI 음성
          </Badge>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Music className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium">BGM</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            자동 선택
          </Badge>
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
              <SelectItem value="slide">슬라이드</SelectItem>
            </SelectContent>
          </Select>
        </Card>
      </div>

      <Card className="border-dashed">
        <CardContent className="p-8 text-center">
          <div className="mx-auto w-32 aspect-[9/16] rounded-lg bg-muted flex items-center justify-center mb-4">
            <Play className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Higgsfield 연동 후 영상이 여기에 표시됩니다
          </p>
          <Button disabled className="gap-1.5">
            <Film className="h-4 w-4" />
            영상 생성하기
          </Button>
        </CardContent>
      </Card>

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

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          이전
        </Button>
      </div>
    </div>
  );
}
