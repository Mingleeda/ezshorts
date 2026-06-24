"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Check,
  ImageIcon,
} from "lucide-react";
import type { StoryProject } from "@/types";

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
  const scenes = project.scenes ?? [];
  const [approvedScenes, setApprovedScenes] = useState<Set<string>>(new Set());

  const toggleApprove = (sceneId: string) => {
    setApprovedScenes((prev) => {
      const next = new Set(prev);
      if (next.has(sceneId)) next.delete(sceneId);
      else next.add(sceneId);
      return next;
    });
  };

  const approveAll = () => {
    setApprovedScenes(new Set(scenes.map((s) => s.id)));
  };

  const allApproved = scenes.length > 0 && approvedScenes.size === scenes.length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">레퍼런스 이미지 확인</h1>
          <p className="text-muted-foreground">
            영상 생성 전 이미지로 느낌을 확인하세요
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={approveAll}>
          전체 승인
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {scenes.map((scene, index) => {
          const isApproved = approvedScenes.has(scene.id);
          return (
            <Card
              key={scene.id}
              className={`overflow-hidden transition-all ${
                isApproved ? "ring-2 ring-primary" : ""
              }`}
            >
              <div className="relative aspect-[9/16] bg-muted flex items-center justify-center">
                <div className="text-center p-4">
                  <ImageIcon className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">
                    Higgsfield 연동 시 생성
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">
                    (유료 전환 필요)
                  </p>
                </div>
                {isApproved && (
                  <div className="absolute top-2 right-2">
                    <div className="rounded-full bg-primary p-1">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  </div>
                )}
              </div>
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium">씬 {index + 1}</p>
                  <Badge variant="outline" className="text-[10px]">
                    {scene.duration}초
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {scene.description}
                </p>
                <div className="flex gap-1.5">
                  <Button
                    variant={isApproved ? "default" : "outline"}
                    size="sm"
                    className="flex-1 text-xs h-7"
                    onClick={() => toggleApprove(scene.id)}
                  >
                    {isApproved ? "승인됨" : "승인"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    disabled
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
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
        <Button
          onClick={onNext}
          disabled={!allApproved}
          className="gap-1.5"
        >
          이 느낌으로 영상 만들기
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
