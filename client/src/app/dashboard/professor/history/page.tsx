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
  {
    id: "p3",
    title: "Operating Systems Quiz",
    course: "FYBSc. CS",
    endedOn: new Date("2025-02-10T11:30:00"),
    submissions: { submitted: 45, total: 50 },
    status: "Grading Complete",
  },
  {
    id: "p4",
    title: "Computer Networks Unit Test",
    course: "SYBSc. CS",
    endedOn: new Date("2025-01-28T10:00:00"),
    submissions: { submitted: 70, total: 75 },
    status: "Pending Grading",
  },
  {
    id: "p5",
    title: "DBMS Practical Viva",
    course: "TYBSc. CS",
    endedOn: new Date("2025-04-05T09:00:00"),
    submissions: { submitted: 30, total: 30 },
    status: "Grading Complete",
  },
  {
    id: "p6",
    title: "Web Development Internal",
    course: "SYBSc. CS",
    endedOn: new Date("2025-03-01T13:00:00"),
    submissions: { submitted: 88, total: 90 },
    status: "Pending Grading",
  },
  {
    id: "p7",
    title: "Linear Algebra Test",
    course: "FYBSc. CS",
    endedOn: new Date("2025-02-18T12:45:00"),
    submissions: { submitted: 50, total: 55 },
    status: "Pending Grading",
  },
  {
    id: "p8",
    title: "Microprocessor Midterm",
    course: "TYBSc. CS",
    endedOn: new Date("2025-03-30T14:15:00"),
    submissions: { submitted: 48, total: 50 },
    status: "Grading Complete",
  },
  {
    id: "p9",
    title: "Software Engineering Assignment Review",
    course: "SYBSc. CS",
    endedOn: new Date("2025-04-12T17:00:00"),
    submissions: { submitted: 92, total: 95 },
    status: "Pending Grading",
  },
  {
    id: "p10",
    title: "AI Mini Project Demo",
    course: "TYBSc. CS",
    endedOn: new Date("2025-03-22T11:00:00"),
    submissions: { submitted: 40, total: 40 },
    status: "Grading Complete",
  },
  {
    id: "p11",
    title: "Discrete Math Class Test",
    course: "FYBSc. CS",
    endedOn: new Date("2025-01-19T09:30:00"),
    submissions: { submitted: 42, total: 50 },
    status: "Pending Grading",
  },
  {
    id: "p12",
    title: "Cyber Security Quiz",
    course: "TYBSc. CS",
    endedOn: new Date("2025-02-27T15:30:00"),
    submissions: { submitted: 75, total: 78 },
    status: "Grading Complete",
  }
];

const ProfessorExamHistoryPage = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 ml-10">Exam History</h1>
      <ExamHistory exams={MOCK_EXAMS} />
    </div>
  );
};

export default ProfessorExamHistoryPage;
