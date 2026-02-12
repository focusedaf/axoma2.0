"use client";
import { useEffect, useState } from "react";
import {
  ExamSchedule,
  Exam,
} from "@/components/ui-elements/studentDash/examSchedule";
import { examStore, PublishedExam } from "@/lib/examStore";

export default function StudentExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    const publishedExams = examStore.getAll();

    const formattedExams: Exam[] = publishedExams.map((exam) => ({
      id: exam.id,
      title: exam.title,
      course: exam.course || "General",
      scheduledOn: new Date(exam.publishedAt),
      duration: exam.duration,
      status: "Live",
    }));

    setExams(formattedExams);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">My Exams</h1>
      <ExamSchedule exams={exams} />
    </div>
  );
}
