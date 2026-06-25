"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mic, Plus, Trash2, Volume2, Loader2 } from "lucide-react";

interface Voice {
  id: string;
  name: string;
  gender: string;
  source: string;
  type: string;
}

interface VoiceAssignment {
  characterName: string;
  voiceId: string;
  voiceName: string;
  gender: string;
}

interface VoiceSetupProps {
  assignments: VoiceAssignment[];
  onChange: (assignments: VoiceAssignment[]) => void;
}

export function VoiceSetup({ assignments, onChange }: VoiceSetupProps) {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(false);
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);

  useEffect(() => {
    loadVoices();
  }, []);

  async function loadVoices() {
    setLoading(true);
    try {
      const res = await fetch("/api/tts/voices");
      const data = await res.json();
      setVoices(data.voices ?? []);
    } catch {}
    setLoading(false);
  }

  function addCharacter() {
    onChange([
      ...assignments,
      { characterName: "", voiceId: "", voiceName: "", gender: "" },
    ]);
  }

  function removeCharacter(index: number) {
    onChange(assignments.filter((_, i) => i !== index));
  }

  function updateCharacter(index: number, updates: Partial<VoiceAssignment>) {
    onChange(
      assignments.map((a, i) => (i === index ? { ...a, ...updates } : a))
    );
  }

  function selectVoice(index: number, voiceId: string) {
    const voice = voices.find((v) => v.id === voiceId);
    if (voice) {
      updateCharacter(index, {
        voiceId: voice.id,
        voiceName: voice.name,
        gender: voice.gender,
      });
    }
  }

  function playPreview(voiceId: string) {
    const voice = voices.find((v) => v.id === voiceId);
    if (voice?.source) {
      setPlayingPreview(voiceId);
      const audio = new Audio(voice.source);
      audio.onended = () => setPlayingPreview(null);
      audio.play().catch(() => setPlayingPreview(null));
    }
  }

  const maleVoices = voices.filter((v) => v.gender === "male");
  const femaleVoices = voices.filter((v) => v.gender === "female");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Mic className="h-4 w-4" />
            캐릭터 음성 설정
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={addCharacter}
            className="gap-1.5 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            캐릭터 추가
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          각 캐릭터에 고정 음성을 설정하면 모든 씬에서 동일한 목소리가 적용됩니다
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-4 gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            음성 목록 로딩 중...
          </div>
        ) : assignments.length === 0 ? (
          <button
            onClick={addCharacter}
            className="w-full rounded-lg border border-dashed p-4 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
          >
            캐릭터를 추가하고 음성을 설정하세요
          </button>
        ) : (
          assignments.map((assignment, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-lg border p-3"
            >
              <Input
                placeholder="캐릭터 이름 (예: 남자)"
                value={assignment.characterName}
                onChange={(e) =>
                  updateCharacter(index, { characterName: e.target.value })
                }
                className="w-28 h-8 text-xs"
              />

              <Select
                value={assignment.voiceId}
                onValueChange={(v) => v && selectVoice(index, v)}
              >
                <SelectTrigger className="flex-1 h-8 text-xs">
                  <SelectValue placeholder="음성 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_" disabled>
                    — 남성 —
                  </SelectItem>
                  {maleVoices.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="__" disabled>
                    — 여성 —
                  </SelectItem>
                  {femaleVoices.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {assignment.voiceId && (
                <Badge variant="secondary" className="text-[10px] shrink-0">
                  {assignment.gender === "male" ? "남" : "여"}
                </Badge>
              )}

              {assignment.voiceId && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 shrink-0"
                  onClick={() => playPreview(assignment.voiceId)}
                  disabled={playingPreview === assignment.voiceId}
                >
                  {playingPreview === assignment.voiceId ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Volume2 className="h-3.5 w-3.5" />
                  )}
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => removeCharacter(index)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
