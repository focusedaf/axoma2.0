"use client";
import React, { useState, useEffect, useRef } from "react";
import ExamHeader from "@/components/ui-elements/examInterface/examHeader";
import Feed from "@/components/ui-elements/examInterface/feed";
import QuestionCard from "@/components/ui-elements/examInterface/questionCard";
import ExamSubmitted from "@/components/ui-elements/examInterface/examSubmitted";

interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
}
const MOCK_QUESTIONS: Question[] = [
  {
    id: 1,
    questionText: "Which of the following is a hydrocarbon?",
    options: ["Argon", "Krypton", "Carbon", "Oxygen"],
    correctAnswer: "Carbon",
  },
  {
    id: 2,
    questionText: "What is the chemical formula for water?",
    options: ["H2O", "CO2", "O2", "CH4"],
    correctAnswer: "H2O",
  },
  {
    id: 3,
    questionText: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
  },
  {
    id: 4,
    questionText: "What is the main component of Earth's atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
    correctAnswer: "Nitrogen",
  },
];

const EXAM_DURATION_MINUTES = 25;

export default function ExamInterface() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [timeRemaining, setTimeRemaining] = useState(
    EXAM_DURATION_MINUTES * 60
  );
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const totalQuestions = MOCK_QUESTIONS.length;
  const currentQuestion = MOCK_QUESTIONS[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Webcam setup
  useEffect(() => {
    const setupWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };
    setupWebcam();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  // Timer
  useEffect(() => {
    if (isExamSubmitted) return;
    if (timeRemaining <= 0) {
      handleSubmitExam();
      return;
    }
    const timer = setInterval(() => setTimeRemaining((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, isExamSubmitted]);

  const handleSelectAnswer = (option: string) =>
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion.id]: option });

  const handleNext = () =>
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, totalQuestions - 1));

  const handlePrevious = () =>
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));

  const handleSubmitExam = () => setIsExamSubmitted(true);

  const handleExit = () => console.log("Exit to dashboard");

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  if (isExamSubmitted) return <ExamSubmitted onExit={handleExit} />;

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 text-gray-800 font-sans p-4 md:p-6 lg:p-8">
      <ExamHeader
        examTitle="Organic Chemistry"
        timeLeft={formatTime(timeRemaining)}
        onSubmit={handleSubmitExam}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <QuestionCard
            currentQuestion={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            progressPercent={progressPercent}
            selectedAnswers={selectedAnswers}
            onSelectAnswer={handleSelectAnswer}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </div>
        <Feed videoRef={videoRef} />
      </div>
    </div>
  );
}
