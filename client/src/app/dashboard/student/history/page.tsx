"use client";
import { useEffect, useState, useCallback } from "react";
import {
  StudentHistoryTable,
  type HistoryExam,
} from "@/components/ui-elements/studentDash/examHistory";
import { submissionStore } from "@/lib/submissionStore";
import { examStore } from "@/lib/examStore";

function buildHistory(): HistoryExam[] {
  return submissionStore.getAll().map((sub) => {
    const exam = examStore.getById(sub.examId);
    return {
      id: sub.submissionId,
      title: sub.examTitle,
      course: sub.course || "General",
      attemptedOn: new Date(sub.submittedAt),
      duration: exam?.duration ?? 0,
      status: sub.grade !== undefined ? "Result Declared" : "Result Pending",
    };
  });
}

export default function StudentHistoryPage() {
  const [exams, setExams] = useState<HistoryExam[]>([]);
  const refresh = useCallback(() => setExams(buildHistory()), []);

  useEffect(() => {
    refresh();
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [refresh]);

  return (
    <div className="container mx-auto py-10">
      <StudentHistoryTable exams={exams} />
    </div>
  );
}
