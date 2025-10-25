"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ExamData,
  SettingsData,
  settingsSchema,
  defaultExamData,
} from "@/types/exam";
import { WizardLayout } from "@/components/layout/WizardLayout";
import { Step1Settings } from "@/components/ui-elements/professorDash/step-1-settings";
import { Step2Questions } from "@/components/ui-elements/professorDash/step-2-questions";
import { Step3Preview } from "@/components/ui-elements/professorDash/step-3-preview";
import { Step4Publish } from "@/components/ui-elements/professorDash/step-4-publish";

export default function CreateExamPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [examData, setExamData] = useState<ExamData>(defaultExamData);

  // Step 1 form
  const step1Form = useForm<SettingsData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: examData,
    mode: "onBlur",
  });

  // Enable Next only if Step 1 form is valid
  const isNextDisabled = currentStep === 1 && !step1Form.formState.isValid;
  const isPublishStep = currentStep === 4;

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await step1Form.trigger();
      if (!isValid) return;

      // Merge Step1 values into examData
      setExamData((prev) => ({ ...prev, ...step1Form.getValues() }));
    }
    setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleCancel = () => {
    // Your cancel logic here
    console.log("Exam creation canceled");
  };

  const handleSaveDraft = () => {
    // Save draft logic
    console.log("Exam saved as draft:", {
      ...examData,
      ...step1Form.getValues(),
    });
  };

  const handlePublish = () => {
    const finalExamData: ExamData = {
      ...step1Form.getValues(),
      questions: examData.questions,
    };
    console.log("Publishing exam:", finalExamData);
    // Call API to publish here
  };

  return (
    <WizardLayout
      currentStep={currentStep}
      steps={[
        { id: 1, name: "Settings" },
        { id: 2, name: "Questions" },
        { id: 3, name: "Preview" },
        { id: 4, name: "Publish" },
      ]}
      onNext={handleNext}
      onBack={handleBack}
      onCancel={handleCancel}
      onSaveDraft={handleSaveDraft}
      onPublish={isPublishStep ? handlePublish : undefined}
      isNextDisabled={isNextDisabled}
    >
      {currentStep === 1 && <Step1Settings form={step1Form} />}
      {currentStep === 2 && (
        <Step2Questions examData={examData} setExamData={setExamData} />
      )}
      {currentStep === 3 && (
        <Step3Preview
          examData={{
            ...step1Form.getValues(),
            questions: examData.questions,
          }}
        />
      )}
      {currentStep === 4 && <Step4Publish />}
    </WizardLayout>
  );
}
