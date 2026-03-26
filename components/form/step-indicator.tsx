"use client";

import { cn } from "@/lib/utils";
import type { FormStep } from "@/lib/types";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: FormStep;
  onStepClick?: (step: FormStep) => void;
}

const steps: { key: FormStep; label: string; number: number }[] = [
  { key: "institution", label: "معلومات المؤسسة", number: 1 },
  { key: "building", label: "البناية", number: 2 },
  { key: "financing", label: "التمويل", number: 3 },
  { key: "targeting", label: "الاستهداف", number: 4 },
  { key: "housing", label: "الإيواء والإطعام", number: 5 },
  { key: "staff", label: "الموارد البشرية", number: 6 },
  { key: "review", label: "المراجعة", number: 7 },
];

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center justify-between gap-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = step.key === currentStep;

          return (
            <li key={step.key} className="flex-1">
              <button
                type="button"
                onClick={() => onStepClick?.(step.key)}
                className={cn(
                  "group flex w-full flex-col items-center gap-2 transition-colors",
                  onStepClick && "cursor-pointer hover:opacity-80",
                  !onStepClick && "cursor-default"
                )}
                disabled={!onStepClick}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                    isCompleted && "border-primary bg-primary text-primary-foreground",
                    isCurrent && "border-accent bg-accent text-accent-foreground",
                    !isCompleted && !isCurrent && "border-border bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : step.number}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium text-center hidden sm:block",
                    isCurrent && "text-accent",
                    isCompleted && "text-primary",
                    !isCompleted && !isCurrent && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mt-5 h-0.5 w-full -translate-y-5 hidden sm:block",
                    index < currentIndex ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
