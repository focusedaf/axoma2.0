import {
  StudentHistoryTable,
  type HistoryExam,
} from "@/components/ui-elements/studentDash/examHistory";

const MOCK_HISTORY: HistoryExam[] = [
  {
    id: "h1",
    title: "Semester 1",
    course: "BSc CS",
    attemptedOn: new Date("2024-10-12T10:30:00"),
    duration: 60,
    status: "Result Declared",
  },
  {
    id: "h2",
    title: "Midterm",
    course: "MSc CS",
    attemptedOn: new Date("2024-09-25T09:00:00"),
    duration: 45,
    status: "Result Pending",
  },
];

export default function StudentHistoryPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Exam History</h1>
      <StudentHistoryTable exams={MOCK_HISTORY} />
    </div>
  );
}
