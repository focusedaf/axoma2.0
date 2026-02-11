"use client";
import { ExamData, Question } from "@/types/exam";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash, Edit } from "lucide-react";
import QuestionEditorDialog from "./questionEditor/questionEditorDialog";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface Step2QuestionsProps {
  examData: ExamData;
  setExamData: React.Dispatch<React.SetStateAction<ExamData>>;
}

export function Step2Questions({ examData, setExamData }: Step2QuestionsProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | undefined>(
    undefined
  );

  const { questions, examType } = examData;

  const handleAddQuestion = (newQuestion: Question) => {
    setExamData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const handleUpdateQuestion = (updatedQuestion: Question) => {
    setExamData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      ),
    }));
  };

  const handleDeleteQuestion = (id: string) => {
    setExamData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }));
  };

  const openEditorForNew = () => {
    setEditingQuestion(undefined);
    setIsEditorOpen(true);
  };

  const openEditorForEdit = (question: Question) => {
    setEditingQuestion(question);
    setIsEditorOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-black">Question Bank</h2>
        <Button onClick={openEditorForNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Question
        </Button>
      </div>

      <div className="space-y-4">
        {questions.length === 0 && (
          <Card className="text-center p-12 text-muted-foreground">
            No questions added yet. Click "Add Question" to start.
          </Card>
        )}

        {questions.map((q, index) => (
          <Card key={q.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">
                {index + 1}. {q.text}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{q.marks} mks</Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEditorForEdit(q)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteQuestion(q.id)}
                >
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>

            {/* MCQ Options */}
            {examType === "mcq" && q.options?.length ? (
              <CardContent>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {q.options.map((opt) => (
                    <li
                      key={opt.id}
                      className={
                        opt.isCorrect ? "font-semibold text-primary" : ""
                      }
                    >
                      {opt.text} {opt.isCorrect && "(Correct)"}
                    </li>
                  ))}
                </ul>
              </CardContent>
            ) : examType === "mcq" ? (
              <CardContent>
                <p className="text-muted-foreground">No options provided.</p>
              </CardContent>
            ) : null}
          </Card>
        ))}
      </div>

      <QuestionEditorDialog
        isOpen={isEditorOpen}
        setIsOpen={setIsEditorOpen}
        examType={examType}
        initialData={editingQuestion}
        onSave={editingQuestion ? handleUpdateQuestion : handleAddQuestion}
      />
    </div>
  );
}
