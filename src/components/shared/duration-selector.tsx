"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Lightbulb } from "lucide-react";
import type { ContentType, DurationRecommendation } from "@/types";
import { getDurationRecommendations } from "@/lib/prompts/duration";

interface DurationSelectorProps {
  storyLength: number;
  contentType: ContentType;
  value: number;
  onChange: (duration: number) => void;
}

export function DurationSelector({
  storyLength,
  contentType,
  value,
  onChange,
}: DurationSelectorProps) {
  const recommendations = getDurationRecommendations(storyLength, contentType);
  const selected = recommendations.find((r) => r.recommended === value);
  const isCustom = !selected;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          영상 길이
          <Badge variant="secondary" className="text-xs font-normal gap-1">
            <Lightbulb className="h-3 w-3" />
            AI 추천
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {recommendations.map((rec) => (
            <div
              key={rec.recommended}
              onClick={() => onChange(rec.recommended)}
              className={`cursor-pointer rounded-lg border p-3 transition-all ${
                value === rec.recommended
                  ? "border-primary bg-primary/5"
                  : "border-transparent bg-muted/30 hover:border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {rec.recommended}초
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {rec.label}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  씬 {rec.sceneCount}개 x 클립 {rec.clipsPerScene}개
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{rec.reason}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            직접 입력:
          </span>
          <div className="flex items-center gap-1.5">
            <Input
              type="number"
              min={15}
              max={60}
              value={isCustom ? value : ""}
              placeholder="초"
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (v >= 15 && v <= 60) onChange(v);
              }}
              className="w-20"
            />
            <span className="text-sm text-muted-foreground">초</span>
          </div>
          <span className="text-xs text-muted-foreground">
            (YouTube Shorts 최대 60초)
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
