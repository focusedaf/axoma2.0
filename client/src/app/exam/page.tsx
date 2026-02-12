"use client";
import React, { useState, useEffect, useRef } from "react";
import ExamHeader from "@/components/ui-elements/examInterface/examHeader";
import Feed from "@/components/ui-elements/examInterface/feed";
import QuestionCard from "@/components/ui-elements/examInterface/questionCard";
import ExamSubmitted from "@/components/ui-elements/examInterface/examSubmitted";
import { initAntiCheat,stopAntiCheat } from "@/lib/antiCheat";
interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

const MOCK_QUESTIONS: Question[] = [
  {
    id: 1,
    questionText: "Which OSI layer is responsible for routing packets?",
    options: [
      "Data Link Layer",
      "Network Layer",
      "Transport Layer",
      "Session Layer",
    ],
    correctAnswer: "Network Layer",
  },
  {
    id: 2,
    questionText: "Which protocol is used to assign IP addresses dynamically?",
    options: ["DNS", "DHCP", "ARP", "HTTP"],
    correctAnswer: "DHCP",
  },
  {
    id: 3,
    questionText: "Which device operates at Layer 2 of the OSI model?",
    options: ["Router", "Switch", "Firewall", "Modem"],
    correctAnswer: "Switch",
  },
  {
    id: 4,
    questionText: "What does TCP provide that UDP does not?",
    options: [
      "Faster transmission",
      "Connectionless communication",
      "Reliability and error correction",
      "Broadcast capability",
    ],
    correctAnswer: "Reliability and error correction",
  },
  {
    id: 5,
    questionText: "What is the default port number for HTTPS?",
    options: ["80", "443", "21", "25"],
    correctAnswer: "443",
  },
  {
    id: 6,
    questionText: "Which protocol resolves domain names to IP addresses?",
    options: ["FTP", "DNS", "SMTP", "ICMP"],
    correctAnswer: "DNS",
  },
];

const EXAM_DURATION_MINUTES = 5;

export default function ExamInterface() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [timeRemaining, setTimeRemaining] = useState(
    EXAM_DURATION_MINUTES * 60,
  );
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const totalQuestions = MOCK_QUESTIONS.length;
  const currentQuestion = MOCK_QUESTIONS[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  useEffect(() => {
    initAntiCheat(handleSubmitExam);

    return () => {
      stopAntiCheat();
    };
  }, []);


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
      "0",
    )}`;
  };

  if (isExamSubmitted) return <ExamSubmitted />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 text-gray-800 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
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
          <div className="aspect-video">
            <Feed />
          </div>
        </div>
      </div>
    </div>
  );
}
