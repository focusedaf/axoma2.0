"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExamData, Question } from "@/types/exam";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import DescriptiveEditor from "./descriptiveEditor";
import McqEditor from "./mcqEditor";
import { v4 as uuidv4 } from "uuid";

interface QuestionEditorDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  examType: ExamData["examType"];
  initialData?: Question;
  onSave: (q: Question) => void;
}

export default function QuestionEditorDialog({
  isOpen,
  setIsOpen,
  examType,
  initialData,
  onSave,
}: QuestionEditorDialogProps) {
  const handleSave = (data: any) => {
    const question: Question = {
      id: initialData?.id || uuidv4(),
      text: data.text,
      type: data.type,
      image: data.image || null,
      marks: initialData?.marks || 1, 
      options:
        data.type === "mcq"
          ? data.options.map((o: any) => ({
              id: o.id || uuidv4(),
              text: o.text,
              isCorrect: o.isCorrect,
            }))
          : [],
    };
    onSave(question);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Question" : "Add Question"}
          </DialogTitle>
        </DialogHeader>

        {examType === "descriptive" && (
          <DescriptiveEditor initialData={initialData} onSave={handleSave} />
        )}

        {examType === "mcq" && (
          <McqEditor initialData={initialData} onSave={handleSave} />
        )}

        <div className="flex justify-end mt-4">
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
