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
import { toast } from "sonner";

export type HistoryExam = {
  id: string;
  title: string;
  course: string;
  attemptedOn: Date;
  duration: number;
  status: "Result Declared" | "Result Pending";
};

interface StudentHistoryProps {
  exams: HistoryExam[];
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

function getStatusVariant(status: HistoryExam["status"]) {
  switch (status) {
    case "Result Declared":
      return "default";
    case "Result Pending":
      return "secondary";
    default:
      return "secondary";
  }
}

export function StudentHistoryTable({ exams }: StudentHistoryProps) {
  return (
    <div className="border rounded-md">
      <Table className="text-center">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Exam Title</TableHead>
            <TableHead className="text-center">Course</TableHead>
            <TableHead className="text-center">Attempted On</TableHead>
            <TableHead className="text-center">Duration</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exams.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No history found.
              </TableCell>
            </TableRow>
          )}

          {exams.map((exam) => (
            <TableRow key={exam.id}>
              <TableCell className="font-medium text-black">
                {exam.title}
              </TableCell>

              <TableCell className="font-medium text-black">
                {exam.course}
              </TableCell>

              <TableCell className="font-medium text-black">
                {formatAttemptedOn(exam.attemptedOn)}
              </TableCell>

              <TableCell className="font-medium text-black">
                {exam.duration} mins
              </TableCell>

              <TableCell>
                <Badge variant={getStatusVariant(exam.status)}>
                  {exam.status}
                </Badge>
              </TableCell>

              <TableCell>
                {exam.status === "Result Declared" ? (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => {
                      toast.promise(
                        new Promise((resolve) => setTimeout(resolve, 1000)),
                        {
                          loading: "Preparing result...",
                          success: `Result downloaded for "${exam.title}"`,
                          error: "Download failed",
                        },
                      );
                    }}
                  >
                    Download Result
                  </Button>
                ) : (
                  <Button size="sm" variant="secondary" disabled>
                    Awaiting Result
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
