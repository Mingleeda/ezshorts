"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Loader2,
  Wand2,
  Check,
  User,
} from "lucide-react";
import type { StoryProject } from "@/types";
import type { WizardState, CharacterRef } from "../stories-wizard";

async function generateViaAPI(prompt: string): Promise<string> {
  const res = await fetch("/api/images/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, model: "recraft_v4_1", aspectRatio: "9:16" }),
  });
  const data = await res.json();
  if (data.imageUrl) return data.imageUrl;
  throw new Error(data.error || "이미지 생성 실패");
}

async function uploadToHiggsfield(imageUrl: string): Promise<string> {
  const res = await fetch("/api/images/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageUrl }),
  });
  const data = await res.json();
  return data.uploadId;
}

function buildCharacterPrompt(
  characterName: string,
  project: Partial<StoryProject>,
  customDescription: string = ""
): string {
  const artStyleEn: Record<string, string> = {
    semi_realistic: "semi-realistic digital art, detailed and polished",
    anime: "anime style, vibrant colors, expressive",
    "3d": "3D rendered, Pixar-style, smooth shading",
    illustration: "flat illustration, clean vector art",
    cinematic: "cinematic photography, dramatic lighting, 35mm film",
  };
  const style = artStyleEn[project.artStyle ?? "semi_realistic"];
  const storyRaw = project.storyText ?? "";
  const storyContext = storyRaw
    .replace(/[""“”"''‘’'][^""“”"''‘’']*[""“”"''‘’']/g, "")
    .replace(/[가-힣]+라고\s*(했|말했|외쳤|소리쳤)/g, "")
    .slice(0, 150);
  const custom = customDescription ? `, appearance: ${customDescription}` : "";

  return `${style}, character portrait of "${characterName}", story context: ${storyContext}${custom}. Single person portrait, clear face visible, upper body, simple clean background, vertical 9:16, high quality, 4K, photorealistic, absolutely no text anywhere, no subtitles, no captions, no watermark, no words, no letters, no writing, no Korean text, no title`;
}

interface ReferenceStepProps {
  project: Partial<StoryProject>;
  onUpdate: (updates: Partial<StoryProject>) => void;
  onNext: () => void;
  onBack: () => void;
  wizardState: WizardState;
  onWizardStateUpdate: (updates: Partial<WizardState>) => void;
}

export function ReferenceStep({
  project,
  onUpdate,
  onNext,
  onBack,
  wizardState,
  onWizardStateUpdate,
}: ReferenceStepProps) {
  const characters = wizardState.characters.length > 0
    ? wizardState.characters
    : extractCharactersFromStory(project.storyText ?? "");

  const [charImages, setCharImages] = useState<Record<string, { url: string; uploadId: string }>>(
    () => {
      const initial: Record<string, { url: string; uploadId: string }> = {};
      wizardState.characterRefs.forEach((ref) => {
        initial[ref.name] = { url: ref.imageUrl, uploadId: ref.uploadId };
      });
      return initial;
    }
  );
  const [loading, setLoading] = useState<Set<string>>(new Set());
  const [approved, setApproved] = useState<Set<string>>(
    () => new Set(wizardState.characterRefs.map((r) => r.name))
  );
  const [customPrompts, setCustomPrompts] = useState<Record<string, string>>({});
  const [editingChar, setEditingChar] = useState<string | null>(null);

  async function generateCharacter(name: string) {
    setLoading((prev) => new Set(prev).add(name));
    setApproved((prev) => { const n = new Set(prev); n.delete(name); return n; });
    try {
      const extra = customPrompts[name] ?? "";
      const prompt = buildCharacterPrompt(name, project, extra);
      const url = await generateViaAPI(prompt);
      const uploadId = await uploadToHiggsfield(url);
      setCharImages((prev) => ({ ...prev, [name]: { url, uploadId } }));
      updateWizardRefs({ ...charImages, [name]: { url, uploadId } });
    } catch (e) {
      console.error("Character image error:", e);
    }
    setLoading((prev) => { const n = new Set(prev); n.delete(name); return n; });
  }

  async function generateAll() {
    for (const name of characters) {
      if (!charImages[name]) {
        await generateCharacter(name);
      }
    }
  }

  function updateWizardRefs(images: Record<string, { url: string; uploadId: string }>) {
    const refs: CharacterRef[] = Object.entries(images).map(([name, data]) => ({
      name,
      imageUrl: data.url,
      uploadId: data.uploadId,
    }));
    onWizardStateUpdate({
      characterRefs: refs,
      referenceImageUrl: refs[0]?.imageUrl ?? "",
      referenceUploadId: refs[0]?.uploadId ?? "",
    });
  }

  function approveCharacter(name: string) {
    setApproved((prev) => new Set(prev).add(name));
  }

  const allGenerated = characters.every((c) => charImages[c]);
  const allApproved = characters.length > 0 && characters.every((c) => approved.has(c));
  const isAnyLoading = loading.size > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">캐릭터 확인</h1>
          <p className="text-muted-foreground">
            각 캐릭터의 외형을 확인하고 고정하세요
          </p>
        </div>
        <Button
          size="sm"
          onClick={generateAll}
          disabled={isAnyLoading}
          className="gap-1.5"
        >
          {isAnyLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Wand2 className="h-3.5 w-3.5" />
          )}
          {allGenerated ? "전체 재생성" : "전체 생성"}
        </Button>
      </div>

      <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
        각 캐릭터별로 이미지를 생성하고 승인하면, 모든 씬에서 동일한 외형이 유지됩니다
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {characters.map((name) => {
          const image = charImages[name];
          const isLoading = loading.has(name);
          const isApproved = approved.has(name);

          return (
            <Card
              key={name}
              className={`overflow-hidden transition-all ${isApproved ? "ring-2 ring-primary" : ""}`}
            >
              <div className="relative aspect-[9/16] bg-muted flex items-center justify-center overflow-hidden">
                {image && !isLoading && (
                  <img
                    src={image.url}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                )}
                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted">
                    <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                    <p className="text-xs text-muted-foreground">
                      {name} 생성 중...
                    </p>
                  </div>
                )}
                {!image && !isLoading && (
                  <button
                    onClick={() => generateCharacter(name)}
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                  >
                    <User className="h-8 w-8 text-muted-foreground/30 mb-2" />
                    <p className="text-xs text-muted-foreground">클릭하여 생성</p>
                  </button>
                )}
                {isApproved && !isLoading && (
                  <div className="absolute top-2 right-2">
                    <div className="rounded-full bg-primary p-1">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  </div>
                )}
              </div>
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {name}
                  </Badge>
                  <button
                    onClick={() => setEditingChar(editingChar === name ? null : name)}
                    className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {editingChar === name ? "닫기" : "외형 설정"}
                  </button>
                </div>
                {editingChar === name && (
                  <input
                    type="text"
                    placeholder="예: 30대, 긴 머리, 정장, 안경"
                    value={customPrompts[name] ?? ""}
                    onChange={(e) =>
                      setCustomPrompts((prev) => ({ ...prev, [name]: e.target.value }))
                    }
                    className="w-full text-xs border rounded-md px-2 py-1.5 bg-background"
                  />
                )}
                <div className="flex gap-1.5">
                  <Button
                    variant={isApproved ? "default" : "outline"}
                    size="sm"
                    className="flex-1 text-xs h-7"
                    onClick={() => approveCharacter(name)}
                    disabled={!image || isLoading}
                  >
                    {isApproved ? "승인됨" : "승인"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    disabled={isLoading}
                    onClick={() => generateCharacter(name)}
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
        <Button onClick={onNext} disabled={!allApproved} className="gap-1.5">
          영상 생성으로
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function extractCharactersFromStory(text: string): string[] {
  const patterns = [
    /남자/g, /여자/g, /엄마/g, /아빠/g, /아이/g,
    /친구/g, /선배/g, /후배/g, /사장/g, /부장/g,
  ];
  const found = new Set<string>();
  for (const p of patterns) {
    if (p.test(text)) {
      found.add(text.match(p)![0]);
    }
  }
  if (found.size === 0) found.add("주인공");
  return Array.from(found);
}
