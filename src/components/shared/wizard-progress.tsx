import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface WizardProgressProps {
  steps: { id: string; label: string }[];
  currentStep: number;
}

export function WizardProgress({ steps, currentStep }: WizardProgressProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors",
                index < currentStep &&
                  "bg-primary text-primary-foreground",
                index === currentStep &&
                  "bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2",
                index > currentStep &&
                  "bg-muted text-muted-foreground"
              )}
            >
              {index < currentStep ? (
                <Check className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </div>
            <span
              className={cn(
                "text-xs whitespace-nowrap",
                index === currentStep
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "mx-2 h-px flex-1",
                index < currentStep ? "bg-primary" : "bg-border"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
