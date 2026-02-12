import { ExamData } from "@/types/exam";

export interface PublishedExam extends ExamData {
  id: string;
  publishedAt: string;
  status: "active" | "draft";
  course?: string; 
}

export const examStore = {
  publish: (examData: ExamData, course?: string): PublishedExam => {
    const publishedExam: PublishedExam = {
      ...examData,
      id: `exam-${Date.now()}`,
      publishedAt: new Date().toISOString(),
      status: "active",
      course: course || "General",
    };

    const exams = examStore.getAll();
    exams.push(publishedExam);
    localStorage.setItem("published_exams", JSON.stringify(exams));

    return publishedExam;
  },

  getAll: (): PublishedExam[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem("published_exams");
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): PublishedExam | null => {
    const exams = examStore.getAll();
    return exams.find((e) => e.id === id) || null;
  },

  saveDraft: (examData: ExamData): PublishedExam => {
    const draft: PublishedExam = {
      ...examData,
      id: `draft-${Date.now()}`,
      publishedAt: new Date().toISOString(),
      status: "draft",
    };

    const drafts = examStore.getDrafts();
    drafts.push(draft);
    localStorage.setItem("exam_drafts", JSON.stringify(drafts));

    return draft;
  },

  getDrafts: (): PublishedExam[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem("exam_drafts");
    return data ? JSON.parse(data) : [];
  },
};
