"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export type ResultExam = {
  id: string;
  title: string;
  course: string;
  attemptedOn: Date;
  status: "Result Declared" | "Result Pending";
};

interface ExamResultProps {
  exams: ResultExam[];
}

function formatAttemptedOn(date: Date) {
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getStatusVariant(status: ResultExam["status"]) {
  switch (status) {
    case "Result Declared":
      return "default";
    case "Result Pending":
      return "secondary";
    default:
      return "secondary";
  }
}

export function ExamResult({ exams }: ExamResultProps) {
  const router = useRouter();

  return (
    <div className="border rounded-md">
      <Table className="text-center">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Exam Title</TableHead>
            <TableHead className="text-center">Course</TableHead>
            <TableHead className="text-center">Attempted On</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exams.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No results found.
              </TableCell>
            </TableRow>
          )}
          {exams.map((exam) => (
            <TableRow key={exam.id}>
              <TableCell>{exam.title}</TableCell>
              <TableCell>{exam.course}</TableCell>
              <TableCell>{formatAttemptedOn(exam.attemptedOn)}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(exam.status)}>
                  {exam.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={exam.status === "Result Pending"}
                  onClick={() => alert(`Downloading result for ${exam.id}`)}
                >
                  Download
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
