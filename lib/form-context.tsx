"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import type { InstitutionRequest, FormStep } from "./types";

interface FormContextType {
  formData: Partial<InstitutionRequest>;
  updateFormData: (data: Partial<InstitutionRequest>, incrementVersion?: boolean) => void;
  currentStep: FormStep;
  setCurrentStep: (step: FormStep) => void;
  resetForm: () => void;
  initializeForm: (data: Partial<InstitutionRequest>) => void;
  isEditMode: boolean;
  editId: number | null;
  setEditMode: (id: number | null) => void;
  formVersion: number; // Increments when form is initialized with new data
}

const FormContext = createContext<FormContextType | undefined>(undefined);

const initialFormData: Partial<InstitutionRequest> = {
  // Boolean fields for services
  housing: false,
  meals: false,
  educationalSupport: false,
  culturalActivities: false,
  healthCare: false,
  insurance: false,
  psychologicalSupport: false,
  // Boolean fields for target levels
  primary: false,
  middleSchool: false,
  highSchool: false,
  other: false,
  // Nested objects
  staffMembers: [],
  building: {},
  financing: {},
  targeting: {},
  housingMeals: {
    season2324: {},
    season2425: {},
    season2526: {},
  },
};

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<Partial<InstitutionRequest>>(initialFormData);
  const [currentStep, setCurrentStep] = useState<FormStep>("institution");
  const [editId, setEditId] = useState<number | null>(null);
  const [formVersion, setFormVersion] = useState(0);

  const updateFormData = useCallback((data: Partial<InstitutionRequest>, incrementVersion = false) => {
    setFormData((prev) => ({ ...prev, ...data }));
    if (incrementVersion) {
      setFormVersion((v) => v + 1);
    }
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setCurrentStep("institution");
    setEditId(null);
    setFormVersion((v) => v + 1);
  }, []);

  const initializeForm = useCallback((data: Partial<InstitutionRequest>) => {
    console.log("[v0] initializeForm called with data:", data);
    setFormData({ ...initialFormData, ...data });
    setCurrentStep("institution");
    setFormVersion((v) => v + 1);
  }, []);

  const setEditMode = useCallback((id: number | null) => {
    setEditId(id);
  }, []);

  return (
    <FormContext.Provider
      value={{
        formData,
        updateFormData,
        currentStep,
        setCurrentStep,
        resetForm,
        initializeForm,
        isEditMode: editId !== null,
        editId,
        setEditMode,
        formVersion,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}
