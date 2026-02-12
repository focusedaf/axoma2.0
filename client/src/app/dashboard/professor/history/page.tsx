"use client";
import { useEffect, useState, useCallback } from "react";
import {
  ExamHistory,
  type Exam,
} from "@/components/ui-elements/professorDash/examHistory";
import { examStore } from "@/lib/examStore";
import { submissionStore } from "@/lib/submissionStore";

function buildHistory(): Exam[] {
  return examStore.getAll().map((exam) => {
    const submissions = submissionStore.getByExamId(exam.id);
    const gradedCount = submissions.filter((s) => s.grade !== undefined).length;
    return {
      id: exam.id,
      title: exam.title,
      course: exam.course || "General",
      endedOn: new Date(exam.publishedAt),
      submissions: { submitted: submissions.length, total: submissions.length },
      status:
        submissions.length > 0 && gradedCount === submissions.length
          ? "Grading Complete"
          : "Pending Grading",
    };
  });
}

export default function ProfessorExamHistoryPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const refresh = useCallback(() => setExams(buildHistory()), []);

  useEffect(() => {
    refresh();
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [refresh]);

  return (
    <div className="container mx-auto py-10">
      <ExamHistory exams={exams} />
    </div>
  );
}
