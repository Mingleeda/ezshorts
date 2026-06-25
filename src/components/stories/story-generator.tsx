"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Loader2, X, RefreshCw } from "lucide-react";

const CATEGORIES = [
  { value: "romance", label: "연애", emoji: "💕" },
  { value: "military", label: "군대", emoji: "🪖" },
  { value: "school", label: "학교", emoji: "📚" },
  { value: "work", label: "직장", emoji: "💼" },
  { value: "family", label: "가족", emoji: "👨‍👩‍👧" },
  { value: "travel", label: "여행", emoji: "✈️" },
  { value: "friend", label: "친구", emoji: "🤝" },
  { value: "neighbor", label: "이웃/동네", emoji: "🏘️" },
  { value: "food", label: "음식/맛집", emoji: "🍜" },
  { value: "horror", label: "공포/괴담", emoji: "👻" },
  { value: "accident", label: "사건/사고", emoji: "🚨" },
  { value: "pet", label: "반려동물", emoji: "🐶" },
];

const MOODS = [
  { value: "funny", label: "웃긴", emoji: "😂" },
  { value: "scary", label: "무서운", emoji: "😱" },
  { value: "touching", label: "감동", emoji: "🥹" },
  { value: "shocking", label: "충격/반전", emoji: "😰" },
  { value: "cringe", label: "소름/오글", emoji: "🫠" },
  { value: "wholesome", label: "훈훈", emoji: "☺️" },
  { value: "rage", label: "분노유발", emoji: "🤬" },
  { value: "mysterious", label: "미스터리", emoji: "🔍" },
];

const SETTINGS = [
  { value: "bar", label: "술집/바", emoji: "🍺" },
  { value: "cafe", label: "카페", emoji: "☕" },
  { value: "home", label: "집", emoji: "🏠" },
  { value: "office", label: "사무실", emoji: "🏢" },
  { value: "subway", label: "지하철/버스", emoji: "🚇" },
  { value: "restaurant", label: "식당", emoji: "🍽️" },
  { value: "park", label: "공원", emoji: "🌳" },
  { value: "hospital", label: "병원", emoji: "🏥" },
  { value: "street", label: "길거리", emoji: "🛣️" },
  { value: "abroad", label: "해외", emoji: "🌏" },
  { value: "mountain", label: "산/캠핑", emoji: "⛰️" },
  { value: "none", label: "상관없음", emoji: "🎲" },
];

const CHARACTERS = [
  { value: "couple", label: "커플/썸", emoji: "💑" },
  { value: "friends", label: "친구들", emoji: "👯" },
  { value: "family", label: "가족", emoji: "👨‍👩‍👧‍👦" },
  { value: "strangers", label: "낯선사람", emoji: "🧑‍🤝‍🧑" },
  { value: "coworkers", label: "직장동료", emoji: "👔" },
  { value: "solo", label: "혼자", emoji: "🧍" },
  { value: "parent_child", label: "부모자식", emoji: "👩‍👦" },
  { value: "teacher_student", label: "선생/학생", emoji: "👩‍🏫" },
];

const TWISTS = [
  { value: "reversal", label: "반전", emoji: "🔄" },
  { value: "misunderstanding", label: "오해", emoji: "❓" },
  { value: "coincidence", label: "우연의 일치", emoji: "🎯" },
  { value: "confession", label: "고백/폭로", emoji: "💣" },
  { value: "karma", label: "인과응보", emoji: "⚖️" },
  { value: "deja_vu", label: "데자뷔", emoji: "👀" },
  { value: "none", label: "없음", emoji: "➡️" },
];

const LENGTHS = [
  { value: "short", label: "짧은 썰 (3~4줄)", sentences: "3-4" },
  { value: "medium", label: "보통 (5~7줄)", sentences: "5-7" },
  { value: "long", label: "긴 썰 (8~10줄)", sentences: "8-10" },
];

interface StoryGeneratorProps {
  onGenerated: (text: string) => void;
  onClose: () => void;
}

export function StoryGenerator({ onGenerated, onClose }: StoryGeneratorProps) {
  const [category, setCategory] = useState("");
  const [mood, setMood] = useState("");
  const [setting, setSetting] = useState("");
  const [character, setCharacter] = useState("");
  const [twist, setTwist] = useState("");
  const [length, setLength] = useState("medium");
  const [keywords, setKeywords] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState("");

  const canGenerate = category && mood;

  async function generate() {
    setIsGenerating(true);
    setGeneratedStory("");

    const catLabel = CATEGORIES.find((c) => c.value === category)?.label ?? "";
    const moodLabel = MOODS.find((m) => m.value === mood)?.label ?? "";
    const settingLabel = SETTINGS.find((s) => s.value === setting)?.label ?? "";
    const charLabel = CHARACTERS.find((c) => c.value === character)?.label ?? "";
    const twistLabel = TWISTS.find((t) => t.value === twist)?.label ?? "";
    const lengthInfo = LENGTHS.find((l) => l.value === length);

    const prompt = [
      `한국어로 ${catLabel} 관련 썰을 하나 만들어줘.`,
      `분위기: ${moodLabel}.`,
      settingLabel && settingLabel !== "상관없음" ? `배경: ${settingLabel}.` : "",
      charLabel ? `등장인물: ${charLabel}.` : "",
      twistLabel && twistLabel !== "없음" ? `전개방식: ${twistLabel} 요소 포함.` : "",
      keywords ? `키워드: ${keywords}.` : "",
      `길이: ${lengthInfo?.sentences ?? "5-7"}문장.`,
      "",
      "규칙:",
      "- 실제 있을법한 현실적인 이야기로 작성",
      "- 대화는 큰따옴표로 감싸기",
      "- 반말 구어체로 자연스럽게",
      "- 시작은 상황 설명, 중간에 사건, 끝에 반응/결과",
      "- 썰 텍스트만 출력, 제목이나 설명 없이",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/story/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.story) {
        setGeneratedStory(data.story);
      }
    } catch {
      setGeneratedStory("썰 생성에 실패했습니다. 다시 시도해주세요.");
    }
    setIsGenerating(false);
  }

  function useStory() {
    onGenerated(generatedStory);
    onClose();
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI 썰 생성기
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 카테고리 */}
        <div>
          <p className="text-xs font-medium mb-2">카테고리 *</p>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <Badge
                key={c.value}
                variant={category === c.value ? "default" : "outline"}
                className="cursor-pointer text-xs px-2.5 py-1 transition-colors"
                onClick={() => setCategory(c.value)}
              >
                {c.emoji} {c.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* 분위기 */}
        <div>
          <p className="text-xs font-medium mb-2">분위기 *</p>
          <div className="flex flex-wrap gap-1.5">
            {MOODS.map((m) => (
              <Badge
                key={m.value}
                variant={mood === m.value ? "default" : "outline"}
                className="cursor-pointer text-xs px-2.5 py-1 transition-colors"
                onClick={() => setMood(m.value)}
              >
                {m.emoji} {m.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* 배경 */}
        <div>
          <p className="text-xs font-medium mb-2">배경/장소</p>
          <div className="flex flex-wrap gap-1.5">
            {SETTINGS.map((s) => (
              <Badge
                key={s.value}
                variant={setting === s.value ? "default" : "outline"}
                className="cursor-pointer text-xs px-2.5 py-1 transition-colors"
                onClick={() => setSetting(s.value)}
              >
                {s.emoji} {s.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* 등장인물 */}
        <div>
          <p className="text-xs font-medium mb-2">등장인물</p>
          <div className="flex flex-wrap gap-1.5">
            {CHARACTERS.map((c) => (
              <Badge
                key={c.value}
                variant={character === c.value ? "default" : "outline"}
                className="cursor-pointer text-xs px-2.5 py-1 transition-colors"
                onClick={() => setCharacter(c.value)}
              >
                {c.emoji} {c.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* 전개방식 */}
        <div>
          <p className="text-xs font-medium mb-2">전개방식</p>
          <div className="flex flex-wrap gap-1.5">
            {TWISTS.map((t) => (
              <Badge
                key={t.value}
                variant={twist === t.value ? "default" : "outline"}
                className="cursor-pointer text-xs px-2.5 py-1 transition-colors"
                onClick={() => setTwist(t.value)}
              >
                {t.emoji} {t.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* 키워드 + 길이 */}
        <div className="flex gap-3">
          <div className="flex-1">
            <p className="text-xs font-medium mb-2">추가 키워드</p>
            <Input
              placeholder="예: 소개팅, 첫인상, 오해"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="text-xs h-8"
            />
          </div>
          <div className="w-36">
            <p className="text-xs font-medium mb-2">길이</p>
            <Select value={length} onValueChange={(v) => v && setLength(v)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LENGTHS.map((l) => (
                  <SelectItem key={l.value} value={l.value}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 생성 버튼 */}
        <Button
          onClick={generate}
          disabled={!canGenerate || isGenerating}
          className="w-full gap-1.5"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {isGenerating ? "썰 쓰는 중..." : "썰 생성하기"}
        </Button>

        {/* 결과 */}
        {generatedStory && (
          <div className="space-y-3 pt-2 border-t">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium">생성된 썰</p>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 gap-1"
                onClick={generate}
                disabled={isGenerating}
              >
                <RefreshCw className="h-3 w-3" />
                다시 생성
              </Button>
            </div>
            <Textarea
              value={generatedStory}
              onChange={(e) => setGeneratedStory(e.target.value)}
              rows={6}
              className="text-sm resize-none"
            />
            <Button onClick={useStory} className="w-full gap-1.5">
              이 썰 사용하기
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
