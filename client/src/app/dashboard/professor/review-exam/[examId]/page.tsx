"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submissionStore, ExamSubmission } from "@/lib/submissionStore";
import { examStore } from "@/lib/examStore";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function GradeExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;

  const [exam, setExam] = useState<any>(null);
  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<ExamSubmission | null>(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const loadedExam = examStore.getById(examId);
    if (!loadedExam) {
      router.push("/dashboard/professor/review-exam");
      return;
    }
    setExam(loadedExam);
    setSubmissions(submissionStore.getByExamId(examId));
  }, [examId, router]);

  const handleGrade = () => {
    if (!selectedSubmission) return;

    const gradeNum = parseFloat(grade);
    if (isNaN(gradeNum)) {
      toast.error("Please enter a valid grade");
      return;
    }

    submissionStore.grade(selectedSubmission.submissionId, gradeNum, feedback);
    toast.success("Graded successfully!");
    setSubmissions(submissionStore.getByExamId(examId));
    setSelectedSubmission(null);
    setGrade("");
    setFeedback("");
  };

  if (!exam) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">{exam.title} - Grading</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Submissions ({submissions.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {submissions.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No submissions yet
              </p>
            )}
            {submissions.map((sub) => (
              <div
                key={sub.submissionId}
                className={`p-3 border rounded cursor-pointer hover:bg-muted ${
                  selectedSubmission?.submissionId === sub.submissionId
                    ? "bg-muted"
                    : ""
                }`}
                onClick={() => {
                  setSelectedSubmission(sub);
                  setGrade(sub.grade?.toString() || "");
                  setFeedback(sub.feedback || "");
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{sub.studentName}</span>
                  {sub.grade !== undefined ? (
                    <Badge>Graded</Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(sub.submittedAt).toLocaleString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Grading Panel */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedSubmission
                ? `Grading ${selectedSubmission.studentName}`
                : "Select a submission"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedSubmission ? (
              <div className="space-y-6">
                {/* Show answers */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Answers:</h3>
                  {exam.questions.map((q: any, index: number) => (
                    <div key={q.id} className="border-b pb-4">
                      <p className="font-medium mb-2">
                        Q{index + 1}: {q.text}
                      </p>
                      <p className="text-sm bg-muted p-3 rounded">
                        {selectedSubmission.answers[q.id] || "(No answer)"}
                      </p>
                      {q.type === "mcq" && q.options && (
                        <p className="text-xs text-green-600 mt-1">
                          Correct:{" "}
                          {q.options.find((o: any) => o.isCorrect)?.text}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Grading form */}
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <label className="text-sm font-medium">
                      Grade (out of {exam.questions.length})
                    </label>
                    <Input
                      type="number"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="Enter grade"
                      max={exam.questions.length}
                      min={0}
                      step={0.5}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Feedback (optional)
                    </label>
                    <Textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Enter feedback"
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleGrade} className="w-full">
                    Submit Grade
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Select a submission from the list to start grading
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
