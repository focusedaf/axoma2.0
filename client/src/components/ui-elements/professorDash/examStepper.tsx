"use client";
import React from "react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, name: "Settings" },
  { id: 2, name: "Questions" },
  { id: 3, name: "Preview" },
  { id: 4, name: "Publish" },
];

interface ExamStepperProps {
  currentStep: number;
}

export function ExamStepper({ currentStep }: ExamStepperProps) {
  return (
    <nav className="flex items-center justify-between py-6">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 text-black",
                currentStep > step.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : currentStep === step.id
                  ? "border-primary"
                  : "border-muted"
              )}
            >
              {step.id}
            </div>
            <p
              className={cn(
                "mt-2 text-sm font-medium",
                currentStep >= step.id
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {step.name}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "flex-1 h-0.5",
                currentStep > step.id ? "bg-primary" : "bg-muted"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
