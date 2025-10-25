"use client";
import React from "react";
import {
  ExamHistory,
  type Exam,
} from "@/components/ui-elements/professorDash/examHistory";

const MOCK_EXAMS: Exam[] = [
  {
    id: "p1",
    title: "Data Structures Midterm",
    course: "SYBSc. CS",
    endedOn: new Date("2025-03-15T14:00:00"),
    submissions: { submitted: 85, total: 90 },
    status: "Grading Complete",
  },
  {
    id: "p2",
    title: "Algorithms Final",
    course: "TYBSc. CS",
    endedOn: new Date("2025-04-20T16:00:00"),
    submissions: { submitted: 60, total: 60 },
    status: "Pending Grading",
  },
];

const ProfessorExamHistoryPage = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Exam History</h1>
      <ExamHistory exams={MOCK_EXAMS} />
    </div>
  );
};

export default ProfessorExamHistoryPage;
