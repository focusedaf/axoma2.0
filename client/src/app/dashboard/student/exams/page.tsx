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
    title: "Machine Learning Theory",
    course: "MSc. Computer Science",
    scheduledOn: new Date("2025-10-28T15:00:00"),
    duration: 120,
    status: "Live",
  },
  {
    id: "e3",
    title: "Cyber Security Quiz",
    course: "BSc. COMPUTER SCIENCE",
    scheduledOn: new Date("2025-10-27T12:00:00"),
    duration: 30,
    status: "Live",
  },
  {
    id: "e4",
    title: "Operating Systems Lab",
    course: "BSc. COMPUTER SCIENCE",
    scheduledOn: new Date("2025-10-26T14:30:00"),
    duration: 60,
    status: "Live",
  },
  {
    id: "e5",
    title: "Software Engineering Oral",
    course: "MSc. Computer Science",
    scheduledOn: new Date("2025-10-25T16:00:00"),
    duration: 20,
    status: "Live",
  },
  {
    id: "e6",
    title: "Java OOP Practical",
    course: "BSc. COMPUTER SCIENCE",
    scheduledOn: new Date("2025-10-29T10:00:00"),
    duration: 50,
    status: "Live",
  },
  {
    id: "e7",
    title: "AI & Robotics Internal",
    course: "MSc. Computer Science",
    scheduledOn: new Date("2025-10-30T13:15:00"),
    duration: 90,
    status: "Live",
  },
  {
    id: "e8",
    title: "Cloud Fundamentals Quiz",
    course: "BSc. COMPUTER SCIENCE",
    scheduledOn: new Date("2025-10-26T09:45:00"),
    duration: 25,
    status: "Live",
  },
  {
    id: "e9",
    title: "Compiler Design Theory",
    course: "MSc. Computer Science",
    scheduledOn: new Date("2025-10-27T11:30:00"),
    duration: 110,
    status: "Live",
  },
  {
    id: "e10",
    title: "Discrete Math Test",
    course: "BSc. COMPUTER SCIENCE",
    scheduledOn: new Date("2025-10-27T08:10:00"),
    duration: 40,
    status: "Live",
  },

  {
    id: "e11",
    title: "Data Structures Midterm",
    course: "BSc. COMPUTER SCIENCE",
    scheduledOn: new Date("2025-11-10T10:00:00"),
    duration: 90,
    status: "Upcoming",
  },
  {
    id: "e12",
    title: "OS Concepts Exam",
    course: "MSc. Computer Science",
    scheduledOn: new Date("2025-11-15T11:00:00"),
    duration: 120,
    status: "Upcoming",
  },
  {
    id: "e13",
    title: "Database Systems Test",
    course: "BSc. COMPUTER SCIENCE",
    scheduledOn: new Date("2025-11-05T13:00:00"),
    duration: 75,
    status: "Upcoming",
  },
  {
    id: "e14",
    title: "Cloud Computing Assessment",
    course: "MSc. Computer Science",
    scheduledOn: new Date("2025-11-20T09:30:00"),
    duration: 60,
    status: "Upcoming",
  },
  {
    id: "e15",
    title: "AI & Robotics Theory",
    course: "MSc. Computer Science",
    scheduledOn: new Date("2025-11-25T14:30:00"),
    duration: 120,
    status: "Upcoming",
  },
  {
    id: "e16",
    title: "Web Development Final",
    course: "BSc. COMPUTER SCIENCE",
    scheduledOn: new Date("2025-11-18T10:30:00"),
    duration: 90,
    status: "Upcoming",
  },
  {
    id: "e17",
    title: "Networking Final",
    course: "MSc. Computer Science",
    scheduledOn: new Date("2025-11-22T16:00:00"),
    duration: 100,
    status: "Upcoming",
  },
  {
    id: "e18",
    title: "Mobile Computing Quiz",
    course: "BSc. COMPUTER SCIENCE",
    scheduledOn: new Date("2025-11-12T09:00:00"),
    duration: 35,
    status: "Upcoming",
  },
  {
    id: "e19",
    title: "Information Security Exam",
    course: "MSc. Computer Science",
    scheduledOn: new Date("2025-11-16T12:00:00"),
    duration: 80,
    status: "Upcoming",
  },
  {
    id: "e20",
    title: "Python Programming Internal",
    course: "BSc. COMPUTER SCIENCE",
    scheduledOn: new Date("2025-11-04T15:30:00"),
    duration: 45,
    status: "Upcoming",
  },
];

export default function StudentExamPage() {
  const liveExams = allExams.filter((e) => e.status === "Live");
  const upcomingExams = allExams.filter((e) => e.status === "Upcoming");

  return (
    <div className="container mx-auto py-10">
      <ExamTabs
        liveCount={liveExams.length}
        upcomingCount={upcomingExams.length}
        liveContent={<ExamSchedule exams={liveExams} />}
        upcomingContent={<ExamSchedule exams={upcomingExams} />}
      />
    </div>
  );
}
