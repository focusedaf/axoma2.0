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
  {
    id: "h3",
    title: "Final Exam",
    course: "BSc CS",
    attemptedOn: new Date("2024-08-15T14:00:00"),
    duration: 90,
    status: "Result Declared",
  },
  {
    id: "h4",
    title: "Data Structures Internal",
    course: "BSc CS",
    attemptedOn: new Date("2024-07-10T11:00:00"),
    duration: 50,
    status: "Result Declared",
  },
  {
    id: "h5",
    title: "Operating Systems Midterm",
    course: "MSc CS",
    attemptedOn: new Date("2024-06-22T13:15:00"),
    duration: 40,
    status: "Result Pending",
  },
  {
    id: "h6",
    title: "Algorithm Design Quiz",
    course: "BSc CS",
    attemptedOn: new Date("2024-05-30T10:00:00"),
    duration: 30,
    status: "Result Declared",
  },
  {
    id: "h7",
    title: "Machine Learning Final",
    course: "MSc CS",
    attemptedOn: new Date("2024-11-02T15:30:00"),
    duration: 120,
    status: "Result Pending",
  },
  {
    id: "h8",
    title: "Database Systems Unit Test",
    course: "BSc CS",
    attemptedOn: new Date("2024-09-05T09:45:00"),
    duration: 35,
    status: "Result Declared",
  },
  {
    id: "h9",
    title: "Computer Networks Practical",
    course: "MSc CS",
    attemptedOn: new Date("2024-10-01T12:30:00"),
    duration: 60,
    status: "Result Declared",
  },
  {
    id: "h10",
    title: "Cyber Security Assessment",
    course: "BSc CS",
    attemptedOn: new Date("2024-08-02T16:00:00"),
    duration: 55,
    status: "Result Pending",
  },
  {
    id: "h11",
    title: "Artificial Intelligence Viva",
    course: "MSc CS",
    attemptedOn: new Date("2024-07-20T14:20:00"),
    duration: 20,
    status: "Result Declared",
  },
  {
    id: "h12",
    title: "Cloud Computing Internal",
    course: "BSc CS",
    attemptedOn: new Date("2024-06-12T10:15:00"),
    duration: 50,
    status: "Result Pending",
  },
];

export default function StudentHistoryPage() {
  return (
    <div className="container mx-auto py-10">
      <StudentHistoryTable exams={MOCK_HISTORY} />
    </div>
  );
}
