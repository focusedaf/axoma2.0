"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ExamHeaderProps {
  currentStep: number;
  onBack: () => void;
  onCancel?: () => void;
  onSaveDraft?: () => void;
  onPublish?: () => void;
}

export function ExamHeader({
  currentStep,
  onBack,
  onCancel,
  onSaveDraft,
  onPublish,
}: ExamHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-4 border-b">
      <div className="flex items-center gap-3">
        {currentStep > 1 && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold">Create manual exam</h1>
          <p className="text-xl text-muted-foreground">
            Craft a new exam with a modern and intuitive interface
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {onCancel && (
          <Button variant="outline" className="  text-black" onClick={onCancel}>
            Cancel
          </Button>
        )}
        {onSaveDraft && (
          <Button variant="secondary" onClick={onSaveDraft}>
            Save Draft
          </Button>
        )}
        {currentStep === 4 && onPublish && (
          <Button onClick={onPublish}>Publish Exam</Button>
        )}
      </div>
    </div>
  );
}
