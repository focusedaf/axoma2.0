"use client";
import { ExamData } from "@/types/exam";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface Step3PreviewProps {
  examData: ExamData;
}

export function Step3Preview({ examData }: Step3PreviewProps) {
  const { title, instructions, duration, questions, examType } = examData;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl text-center">{title}</CardTitle>
        <CardDescription className="text-center">
          Duration: {duration} minutes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 border rounded-md bg-muted/50 mb-6">
          <h4 className="font-semibold mb-2">Instructions:</h4>
          <p className="text-sm">
            {instructions || "No instructions provided."}
          </p>
        </div>

        <Separator className="my-6" />

        <div className="space-y-6">
          {questions.map((q, index) => (
            <div key={q.id} className="space-y-3">
              <div className="flex justify-between items-start mb-2">
                <p className="font-semibold text-lg">
                  {index + 1}. {q.text}
                </p>
                <Badge variant="outline">{q.marks} mks</Badge>
              </div>

              
              {q.image && (
                <div className="ml-6">
                  <img
                    src={q.image}
                    alt="Question"
                    className="max-h-48 rounded border"
                  />
                </div>
              )}

              {examType === "mcq" && q.options?.length ? (
                <ul className="pl-5 space-y-2">
                  {q.options.map((opt) => (
                    <li key={opt.id} className="flex items-center gap-3">
                      <span className="h-5 w-5 border border-muted-foreground rounded-full block" />
                      <span>{opt.text}</span>
                    </li>
                  ))}
                </ul>
              ) : examType === "mcq" ? (
                <p className="text-muted-foreground">No options provided.</p>
              ) : (
                <div className="p-4 border border-dashed rounded-md mt-4">
                  <p className="text-muted-foreground text-sm">
                    (Space for descriptive answer)
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
