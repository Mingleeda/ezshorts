"use client";

import { useState, useCallback } from "react";
import { StoryInput } from "./steps/story-input";
import { MoodboardStep } from "./steps/moodboard-step";
import { ScenarioStep } from "./steps/scenario-step";
import { ReferenceStep } from "./steps/reference-step";
import { GenerateStep } from "./steps/generate-step";
import { ComposeStep } from "./steps/compose-step";
import { WizardProgress } from "@/components/shared/wizard-progress";
import { saveProject, generateId } from "@/lib/storage";
import type { StoryProject } from "@/types";

const STEPS = [
  { id: "input", label: "썰 입력" },
  { id: "moodboard", label: "분위기 선택" },
  { id: "scenario", label: "시나리오" },
  { id: "reference", label: "캐릭터 확인" },
  { id: "generate", label: "영상 생성" },
  { id: "compose", label: "합성 & 편집" },
];

export function StoriesWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [project, setProject] = useState<Partial<StoryProject>>({
    id: generateId(),
    type: "stories",
    platform: "youtube_shorts",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [referenceImageUrl, setReferenceImageUrl] = useState<string>("");
  const [generatedVideos, setGeneratedVideos] = useState<
    { sceneId: string; videoUrl: string }[]
  >([]);

  const goNext = () =>
    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const updateProject = useCallback(
    (updates: Partial<StoryProject>) => {
      setProject((prev) => {
        const updated = { ...prev, ...updates, updatedAt: new Date() };
        if (updated.id && updated.storyText) {
          const name =
            updated.name ??
            updated.storyText.slice(0, 20) +
              (updated.storyText.length > 20 ? "..." : "");
          saveProject({ ...updated, name } as StoryProject);
        }
        return updated;
      });
    },
    []
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <WizardProgress steps={STEPS} currentStep={currentStep} />
      <div className="mt-8">
        {currentStep === 0 && (
          <StoryInput
            project={project}
            onUpdate={updateProject}
            onNext={goNext}
          />
        )}
        {currentStep === 1 && (
          <MoodboardStep
            project={project}
            onUpdate={updateProject}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        {currentStep === 2 && (
          <ScenarioStep
            project={project}
            onUpdate={updateProject}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        {currentStep === 3 && (
          <ReferenceStep
            project={project}
            onUpdate={updateProject}
            onNext={goNext}
            onBack={goBack}
            onReferenceGenerated={setReferenceImageUrl}
          />
        )}
        {currentStep === 4 && (
          <GenerateStep
            project={project}
            referenceImageUrl={referenceImageUrl}
            onBack={goBack}
            onNext={goNext}
            onVideosGenerated={setGeneratedVideos}
          />
        )}
        {currentStep === 5 && (
          <ComposeStep
            project={project}
            videos={generatedVideos}
            onBack={goBack}
          />
        )}
      </div>
    </div>
  );
}
