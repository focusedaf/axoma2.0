"use client";
import { useEffect, useState, useCallback } from "react";
import {
  ExamResult,
  type ResultExam,
} from "@/components/ui-elements/studentDash/examResults";
import { submissionStore } from "@/lib/submissionStore";

function buildResults(): ResultExam[] {
  return submissionStore.getAll().map((sub) => ({
    id: sub.submissionId,
    title: sub.examTitle,
    course: sub.course || "General",
    attemptedOn: new Date(sub.submittedAt),
    status: sub.grade !== undefined ? "Result Declared" : "Result Pending",
  }));
}

export default function StudentResultsPage() {
  const [exams, setExams] = useState<ResultExam[]>([]);
  const refresh = useCallback(() => setExams(buildResults()), []);

  useEffect(() => {
    refresh();
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [refresh]);

  return (
    <div className="container mx-auto py-10">
      <ExamResult exams={exams} />
    </div>
  );
}
