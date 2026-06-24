"use client";

import { useState } from "react";
import { StoryInput } from "./steps/story-input";
import { MoodboardStep } from "./steps/moodboard-step";
import { ScenarioStep } from "./steps/scenario-step";
import { ReferenceStep } from "./steps/reference-step";
import { GenerateStep } from "./steps/generate-step";
import { WizardProgress } from "@/components/shared/wizard-progress";
import type { StoryProject } from "@/types";

const STEPS = [
  { id: "input", label: "썰 입력" },
  { id: "moodboard", label: "분위기 선택" },
  { id: "scenario", label: "시나리오" },
  { id: "reference", label: "이미지 확인" },
  { id: "generate", label: "영상 생성" },
];

export function StoriesWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [project, setProject] = useState<Partial<StoryProject>>({
    type: "stories",
    platform: "youtube_shorts",
  });

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const updateProject = (updates: Partial<StoryProject>) => {
    setProject((prev) => ({ ...prev, ...updates }));
  };

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
          />
        )}
        {currentStep === 4 && (
          <GenerateStep project={project} onBack={goBack} />
        )}
      </div>
    </div>
  );
}
