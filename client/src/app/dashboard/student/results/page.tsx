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
  {
    id: "r4",
    title: "Data Structures Internal",
    course: "BSc CS",
    attemptedOn: new Date("2024-07-10T11:00:00"),
    status: "Result Declared",
  },
  {
    id: "r5",
    title: "Operating Systems Midterm",
    course: "MSc CS",
    attemptedOn: new Date("2024-06-22T13:15:00"),
    status: "Result Pending",
  },
  {
    id: "r6",
    title: "Algorithm Design Quiz",
    course: "BSc CS",
    attemptedOn: new Date("2024-05-30T10:00:00"),
    status: "Result Declared",
  },
  {
    id: "r7",
    title: "Machine Learning Final",
    course: "MSc CS",
    attemptedOn: new Date("2024-11-02T15:30:00"),
    status: "Result Pending",
  },
  {
    id: "r8",
    title: "Database Systems Unit Test",
    course: "BSc CS",
    attemptedOn: new Date("2024-09-05T09:45:00"),
    status: "Result Declared",
  },
  {
    id: "r9",
    title: "Computer Networks Practical",
    course: "MSc CS",
    attemptedOn: new Date("2024-10-01T12:30:00"),
    status: "Result Declared",
  },
  {
    id: "r10",
    title: "Cyber Security Assessment",
    course: "BSc CS",
    attemptedOn: new Date("2024-08-02T16:00:00"),
    status: "Result Pending",
  },
  {
    id: "r11",
    title: "Artificial Intelligence Viva",
    course: "MSc CS",
    attemptedOn: new Date("2024-07-20T14:20:00"),
    status: "Result Declared",
  },
  {
    id: "r12",
    title: "Cloud Computing Internal",
    course: "BSc CS",
    attemptedOn: new Date("2024-06-12T10:15:00"),
    status: "Result Pending",
  },
];


const StudentResultsPage = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 ml-10">Your Exam Results</h1>
      <ExamResult exams={MOCK_RESULTS} />
    </div>
  );
};

export default StudentResultsPage;
