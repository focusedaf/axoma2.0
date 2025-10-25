"use client";
import React from "react";
import {
  ExamResult,
  type ResultExam,
} from "@/components/ui-elements/studentDash/examResults";

const MOCK_RESULTS: ResultExam[] = [
  {
    id: "r1",
    title: "Semester 1 Exam",
    course: "BSc CS",
    attemptedOn: new Date("2024-10-12T10:30:00"),
    status: "Result Declared",
  },
  {
    id: "r2",
    title: "Midterm Exam",
    course: "MSc CS",
    attemptedOn: new Date("2024-09-25T09:00:00"),
    status: "Result Pending",
  },
  {
    id: "r3",
    title: "Final Exam",
    course: "BSc CS",
    attemptedOn: new Date("2024-08-15T14:00:00"),
    status: "Result Declared",
  },
];

const StudentResultsPage = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Your Exam Results</h1>
      <ExamResult exams={MOCK_RESULTS} />
    </div>
  );
};

export default StudentResultsPage;
