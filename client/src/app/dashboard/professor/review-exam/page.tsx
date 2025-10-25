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
];

const ReviewExamPage = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Review Exams</h1>
      <ReviewExam exams={MOCK_EXAMS} />
    </div>
  );
};

export default ReviewExamPage;
