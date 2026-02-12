"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { toast } from "sonner";
import { examStore } from "@/lib/examStore";

export default function CreateExamPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [examData, setExamData] = useState<ExamData>(defaultExamData);
  const step1Form = useForm<SettingsData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: examData,
    mode: "onBlur",
  });

  const isNextDisabled = currentStep === 1 && !step1Form.formState.isValid;
  const isPublishStep = currentStep === 4;

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await step1Form.trigger();
      if (!isValid) return;

      setExamData((prev) => ({ ...prev, ...step1Form.getValues() }));
    }
    setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleCancel = () => {
    toast.info("Exam creation canceled");
    setTimeout(() => {
      router.push("/dashboard/professor");
    }, 800);
  };

  const handleSaveDraft = () => {
    const draftData = {
      ...examData,
      ...step1Form.getValues(),
    };

    const savedDraft = examStore.saveDraft(draftData);
    toast.success("Draft saved successfully");
    console.log("Exam saved as draft:", savedDraft);

    setTimeout(() => {
      router.push("/dashboard/professor");
    }, 800);
  };

  const handlePublish = () => {
    const finalExamData: ExamData = {
      ...step1Form.getValues(),
      questions: examData.questions,
    };

    const publishedExam = examStore.publish(finalExamData);
    toast.success("Exam published successfully");
    console.log("Publishing exam:", publishedExam);

    setTimeout(() => {
      router.push("/dashboard/professor"); // Fixed: Goes back to professor dashboard
    }, 800);
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
