"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import ExamHeader from "@/components/ui-elements/examInterface/examHeader";
import Feed from "@/components/ui-elements/examInterface/feed";
import QuestionCard from "@/components/ui-elements/examInterface/questionCard";
import ExamSubmitted from "@/components/ui-elements/examInterface/examSubmitted";
import { initAntiCheat, stopAntiCheat } from "@/lib/antiCheat";
import { examStore, PublishedExam } from "@/lib/examStore";
import { Question } from "@/types/exam";
import { Card } from "@/components/ui/card";

export default function ExamInterface() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;

  const [exam, setExam] = useState<PublishedExam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedExam = examStore.getById(examId);
    if (!loadedExam) {
      router.push("/dashboard/student/exams");
      return;
    }
    setExam(loadedExam);
    setTimeRemaining(loadedExam.duration * 60);
    setIsLoading(false);
  }, [examId, router]);

  useEffect(() => {
    initAntiCheat(handleSubmitExam);
    return () => stopAntiCheat();
  }, []);

  useEffect(() => {
    if (isExamSubmitted || !exam) return;
    if (timeRemaining <= 0) {
      handleSubmitExam();
      return;
    }
    const timer = setInterval(() => setTimeRemaining((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, isExamSubmitted, exam]);

  const handleSubmitExam = () => {
    setIsExamSubmitted(true);
    console.log("Exam submitted with answers:", selectedAnswers);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200">
        <Card className="p-8">
          <p className="text-lg">Loading exam...</p>
        </Card>
      </div>
    );
  }

  if (!exam) {
    return null;
  }

  const totalQuestions = exam.questions.length;
  const currentQuestion = exam.questions[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleSelectAnswer = (option: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: option,
    });
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  };

  const displayQuestion = {
    id: currentQuestion.id,
    questionText: currentQuestion.text,
    options:
      currentQuestion.type === "mcq"
        ? currentQuestion.options?.map((o) => o.text) || []
        : [],
    image: currentQuestion.image || null,
  };

  if (isExamSubmitted) return <ExamSubmitted />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 text-gray-800 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        <ExamHeader
          examTitle={exam.title}
          timeLeft={formatTime(timeRemaining)}
          onSubmit={handleSubmitExam}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <QuestionCard
              currentQuestion={displayQuestion}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={totalQuestions}
              progressPercent={progressPercent}
              selectedAnswers={selectedAnswers}
              onSelectAnswer={handleSelectAnswer}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          </div>
          <div className="aspect-video">
            <Feed />
          </div>
        </div>
      </div>
    </div>
  );
}
