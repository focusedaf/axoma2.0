"use client";
import { useEffect, useState, useCallback } from "react";
import {
  ReviewExam,
  type ReviewExams,
} from "@/components/ui-elements/professorDash/reviewExam";
import { examStore } from "@/lib/examStore";
import { submissionStore } from "@/lib/submissionStore";

function buildReviewExams(): ReviewExams[] {
  return examStore.getAll().map((exam) => {
    const submissions = submissionStore.getByExamId(exam.id);
    const gradedCount = submissions.filter((s) => s.grade !== undefined).length;
    return {
      id: exam.id,
      title: exam.title,
      course: exam.course || "General",
      conductedOn: new Date(exam.publishedAt),
      submissions: { submitted: submissions.length, total: submissions.length },
      status:
        submissions.length > 0 && gradedCount === submissions.length
          ? "Grading Complete"
          : "Pending Grading",
    };
  });
}

export default function ReviewExamPage() {
  const [exams, setExams] = useState<ReviewExams[]>([]);
  const refresh = useCallback(() => setExams(buildReviewExams()), []);

  useEffect(() => {
    refresh();
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [refresh]);

  return (
    <div className="container mx-auto py-10">
      <ReviewExam exams={exams} />
    </div>
  );
}
