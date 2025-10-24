import React from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import QuestionProgressBar  from "./questionProgressBar";
import QuestionOptions  from "./questionOptions";
import ExamNavigation from '../buttons/examNav';

interface QuestionCardProps {
  currentQuestion: { id: number; questionText: string; options: string[] };
  currentQuestionIndex: number;
  totalQuestions: number;
  progressPercent: number;
  selectedAnswers: Record<number, string>;
  onSelectAnswer: (option: string) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const QuestionCard = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  progressPercent,
  selectedAnswers,
  onSelectAnswer,
  onPrevious,
  onNext,
}: QuestionCardProps) => {
  return (
    <Card className="w-full max-w-4xl mx-auto border shadow-sm">
      <CardHeader className="border-b pb-4">
        <h2 className="text-xl font-semibold">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </h2>
        <QuestionProgressBar
          current={currentQuestionIndex + 1}
          total={totalQuestions}
          percent={progressPercent}
        />
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <p className="text-lg text-gray-800">{currentQuestion.questionText}</p>
        <QuestionOptions
          question={currentQuestion}
          selectedOption={selectedAnswers[currentQuestion.id]}
          onSelectAnswer={onSelectAnswer}
        />
      </CardContent>
      <CardFooter className="border-t bg-gray-50 p-6 rounded-b-lg">
        <ExamNavigation
          onPrevious={onPrevious}
          onNext={onNext}
          isFirstQuestion={currentQuestionIndex === 0}
          isLastQuestion={currentQuestionIndex === totalQuestions - 1}
        />
      </CardFooter>
    </Card>
  );
};

export default QuestionCard