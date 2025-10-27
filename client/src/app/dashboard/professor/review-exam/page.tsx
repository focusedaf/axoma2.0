"use client";
import {
  ReviewExam,
  type ReviewExams,
} from "@/components/ui-elements/professorDash/reviewExam";

const MOCK_EXAMS: ReviewExams[] = [
  {
    id: "r1",
    title: "Data Structures Midterm",
    course: "SYBSc. CS",
    conductedOn: new Date("2025-04-15T10:00:00"),
    submissions: { submitted: 85, total: 90 },
    status: "Pending Grading",
  },
  {
    id: "r2",
    title: "Algorithms Final",
    course: "TYBSc. CS",
    conductedOn: new Date("2025-03-20T14:00:00"),
    submissions: { submitted: 78, total: 80 },
    status: "Grading Complete",
  },
  {
    id: "r3",
    title: "Database Systems Test",
    course: "SYBSc. CS",
    conductedOn: new Date("2025-04-10T09:30:00"),
    submissions: { submitted: 90, total: 90 },
    status: "Pending Grading",
  },
  {
    id: "r4",
    title: "Operating Systems Internal",
    course: "TYBSc. CS",
    conductedOn: new Date("2025-02-28T11:00:00"),
    submissions: { submitted: 67, total: 75 },
    status: "Pending Grading",
  },
  {
    id: "r5",
    title: "Computer Networks Quiz",
    course: "FYBSc. CS",
    conductedOn: new Date("2025-03-05T16:00:00"),
    submissions: { submitted: 120, total: 130 },
    status: "Grading Complete",
  },
  {
    id: "r6",
    title: "Theory of Computation Final",
    course: "TYBSc. CS",
    conductedOn: new Date("2025-03-30T13:00:00"),
    submissions: { submitted: 55, total: 60 },
    status: "Pending Grading",
  },
  {
    id: "r7",
    title: "Software Engineering Project Viva",
    course: "SYBSc. CS",
    conductedOn: new Date("2025-04-02T09:00:00"),
    submissions: { submitted: 45, total: 45 },
    status: "Grading Complete",
  },
  {
    id: "r8",
    title: "Discrete Mathematics Midterm",
    course: "FYBSc. CS",
    conductedOn: new Date("2025-03-10T10:00:00"),
    submissions: { submitted: 98, total: 100 },
    status: "Pending Grading",
  },
  {
    id: "r9",
    title: "Cloud Computing Endsem",
    course: "TYBSc. CS",
    conductedOn: new Date("2025-03-25T15:30:00"),
    submissions: { submitted: 74, total: 80 },
    status: "Grading Complete",
  },
  {
    id: "r10",
    title: "Microprocessors Lab Exam",
    course: "SYBSc. CS",
    conductedOn: new Date("2025-02-18T12:00:00"),
    submissions: { submitted: 50, total: 55 },
    status: "Pending Grading",
  },
  {
    id: "r11",
    title: "Computer Graphics Assignment Review",
    course: "SYBSc. CS",
    conductedOn: new Date("2025-04-08T14:30:00"),
    submissions: { submitted: 65, total: 70 },
    status: "Grading Complete",
  },
];

const ReviewExamPage = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 ml-10">Review Exams</h1>
      <ReviewExam exams={MOCK_EXAMS} />
    </div>
  );
};

export default ReviewExamPage;
