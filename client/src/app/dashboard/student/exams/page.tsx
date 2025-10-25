import {
  ExamSchedule,
  type Exam,
} from "@/components/ui-elements/studentDash/examSchedule";
import { ExamTabs } from "@/components/ui-elements/studentDash/examTabs";

const allExams: Exam[] = [
  {
    id: "e1",
    title: "Networking Basics Quiz",
    course: "BSc. COMPUTER SCIENCE",
    scheduledOn: new Date("2025-10-25T09:00:00"), 
    duration: 45,
    status: "Live",
  },
  {
    id: "e2",
    title: "Data Structures Midterm",
    course: "BSc. COMPUTER SCIENCE",
    scheduledOn: new Date("2025-11-10T10:00:00"),
    duration: 90,
    status: "Upcoming",
  },
  {
    id: "e3",
    title: "OS Concepts Exam",
    course: "MSc. Computer Science",
    scheduledOn: new Date("2025-11-15T11:00:00"),
    duration: 120,
    status: "Upcoming",
  },
  {
    id: "e4",
    title: "Intro to Python Lab",
    course: "BSc. COMPUTER SCIENCE",
    scheduledOn: new Date("2025-10-20T14:00:00"),
    duration: 60,
    status: "Closed",
  },
];


export default function StudentExamPage() {
  
  const liveExams = allExams.filter((e) => e.status === "Live");
  const upcomingExams = allExams.filter((e) => e.status === "Upcoming");

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Your Exams</h1>

      <ExamTabs
        liveCount={liveExams.length}
        upcomingCount={upcomingExams.length}
        liveContent={<ExamSchedule exams={liveExams} />}
        upcomingContent={<ExamSchedule exams={upcomingExams} />}
      />
    </div>
  );
}
