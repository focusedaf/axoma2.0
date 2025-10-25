// /types/exam.ts
import { z } from "zod";

// --- Step 1: Exam Settings ---
export const settingsSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  duration: z.number().min(1, "Duration must be at least 1 minute."),
  instructions: z.string().optional(),
  examType: z.enum(["mcq", "descriptive"]),
  deliveryType: z.enum(["paper", "computer"]),
  questionView: z.enum(["all-in-one", "one-by-one"]),
  allowPrevious: z.boolean(),
  restrictTime: z.boolean(),
  shuffleQuestions: z.boolean(),
  showResults: z.boolean(),
});

export type SettingsData = z.infer<typeof settingsSchema>;

// --- Step 2: Questions ---
export type QuestionOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type Question = {
  id: string;
  text: string;
  marks: number;
  type: "mcq" | "descriptive";
  options?: QuestionOption[];
  image?: string | null;
};

// --- Combined Exam Data ---
export type ExamData = SettingsData & {
  questions: Question[];
};

export const defaultExamData: ExamData = {
  title: "",
  duration: 60,
  instructions: "",
  examType: "mcq",
  deliveryType: "computer",
  questionView: "all-in-one",
  allowPrevious: false,
  restrictTime: false,
  shuffleQuestions: false,
  showResults: false,
  questions: [],
};
