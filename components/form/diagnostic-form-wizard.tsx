"use client";

import { useEffect } from "react";
import { FormProvider, useFormContext } from "@/lib/form-context";
import { useAuth } from "@/lib/auth-context";
import { StepIndicator } from "./step-indicator";
import { InstitutionStep } from "./steps/institution-step";
import { BuildingStep } from "./steps/building-step";
import { FinancingStep } from "./steps/financing-step";
import { TargetingStep } from "./steps/targeting-step";
import { HousingStep } from "./steps/housing-step";
import { StaffStep } from "./steps/staff-step";
import { ReviewStep } from "./steps/review-step";

function FormContent() {
  const { currentStep, setCurrentStep, updateFormData, isEditMode, formData } = useFormContext();
  const { user } = useAuth();

  // Pre-fill region and prefecture for USER role on new institutions
  useEffect(() => {
    console.log("[v0] FormContent useEffect - user:", user);
    console.log("[v0] isEditMode:", isEditMode, "formData.regionId:", formData.regionId);
    if (user?.role === "USER" && !isEditMode && user.regionId && !formData.regionId) {
      console.log("[v0] Pre-filling regionId:", user.regionId, "prefectureId:", user.prefectureId);
      updateFormData({
        regionId: user.regionId,
        prefectureId: user.prefectureId,
      });
    }
  }, [user, isEditMode, updateFormData, formData.regionId]);

  const renderStep = () => {
    switch (currentStep) {
      case "institution":
        return <InstitutionStep />;
      case "building":
        return <BuildingStep />;
      case "financing":
        return <FinancingStep />;
      case "targeting":
        return <TargetingStep />;
      case "housing":
        return <HousingStep />;
      case "staff":
        return <StaffStep />;
      case "review":
        return <ReviewStep />;
      default:
        return <InstitutionStep />;
    }
  };

  return (
    <div className="space-y-8">
      <StepIndicator currentStep={currentStep} onStepClick={setCurrentStep} />
      <div className="animate-in fade-in-0 duration-300">{renderStep()}</div>
    </div>
  );
}

export function DiagnosticFormWizard() {
  return (
    <FormProvider>
      <FormContent />
    </FormProvider>
  );
}
