"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight } from "lucide-react";
import type { StoryProject, Atmosphere } from "@/types";

const atmospheres: { value: Atmosphere; label: string; emoji: string }[] = [
  { value: "funny", label: "웃긴", emoji: "😂" },
  { value: "scary", label: "무서운", emoji: "👻" },
  { value: "touching", label: "감동", emoji: "🥹" },
  { value: "shocking", label: "충격", emoji: "😱" },
  { value: "calm", label: "잔잔한", emoji: "😌" },
  { value: "exciting", label: "신나는", emoji: "🔥" },
];

interface StoryInputProps {
  project: Partial<StoryProject>;
  onUpdate: (updates: Partial<StoryProject>) => void;
  onNext: () => void;
}

export function StoryInput({ project, onUpdate, onNext }: StoryInputProps) {
  const [text, setText] = useState(project.storyText ?? "");
  const [atmosphere, setAtmosphere] = useState<Atmosphere>(
    project.atmosphere ?? "funny"
  );

  const canProceed = text.trim().length >= 10;

  const handleNext = () => {
    onUpdate({ storyText: text, atmosphere });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">썰 쇼츠 만들기</h1>
        <p className="text-muted-foreground">
          썰을 입력하면 AI가 영상으로 만들어드려요
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">썰을 입력하세요</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="여기에 썰을 적어주세요... (최소 10자)&#10;&#10;예: 군대에서 진짜 있었던 일인데, 훈련소 3주차에 조교가 갑자기 생활관에 들어오더니..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {text.length}자
            </span>
            <Button variant="outline" size="sm" className="gap-1.5" disabled>
              <Sparkles className="h-3.5 w-3.5" />
              AI로 썰 생성하기
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">분위기</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {atmospheres.map((atm) => (
              <Badge
                key={atm.value}
                variant={atmosphere === atm.value ? "default" : "outline"}
                className="cursor-pointer text-sm px-3 py-1.5 transition-colors"
                onClick={() => setAtmosphere(atm.value)}
              >
                {atm.emoji} {atm.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={!canProceed} className="gap-1.5">
          다음
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
