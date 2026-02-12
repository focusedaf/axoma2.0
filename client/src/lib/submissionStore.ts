import { PublishedExam } from "./examStore";

export interface ExamSubmission {
  submissionId: string;
  examId: string;
  examTitle: string;
  course: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  answers: Record<string, string>;
  grade?: number;
  gradedAt?: string;
  feedback?: string;
}

export const submissionStore = {
  submit: (
    exam: PublishedExam,
    answers: Record<string, string>,
    studentId: string = "student-001",
    studentName: string = "Test Student",
  ): ExamSubmission => {
    const submission: ExamSubmission = {
      submissionId: `sub-${Date.now()}`,
      examId: exam.id,
      examTitle: exam.title,
      course: exam.course || "General",
      studentId,
      studentName,
      submittedAt: new Date().toISOString(),
      answers,
    };

    const submissions = submissionStore.getAll();
    submissions.push(submission);
    localStorage.setItem("exam_submissions", JSON.stringify(submissions));

    return submission;
  },

  getAll: (): ExamSubmission[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem("exam_submissions");
    return data ? JSON.parse(data) : [];
  },

  getByExamId: (examId: string): ExamSubmission[] => {
    return submissionStore.getAll().filter((s) => s.examId === examId);
  },

  grade: (
    submissionId: string,
    grade: number,
    feedback?: string,
  ): ExamSubmission | null => {
    const submissions = submissionStore.getAll();
    const index = submissions.findIndex((s) => s.submissionId === submissionId);

    if (index === -1) return null;

    submissions[index] = {
      ...submissions[index],
      grade,
      feedback,
      gradedAt: new Date().toISOString(),
    };

    localStorage.setItem("exam_submissions", JSON.stringify(submissions));
    return submissions[index];
  },

  getById: (submissionId: string): ExamSubmission | null => {
    const submissions = submissionStore.getAll();
    return submissions.find((s) => s.submissionId === submissionId) || null;
  },
};
