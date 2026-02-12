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
import { toast } from "sonner";

export type Exam = {
  id: string;
  title: string;
  course: string;
  endedOn: Date;
  submissions: { submitted: number; total: number };
  status: "Grading Complete" | "Pending Grading";
};

interface ExamHistoryProps {
  exams: Exam[];
}

function formatEndedOn(date: Date) {
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getStatusVariant(status: Exam["status"]) {
  switch (status) {
    case "Grading Complete":
      return "default";
    case "Pending Grading":
      return "secondary";
    default:
      return "secondary";
  }
}

export function ExamHistory({ exams }: ExamHistoryProps) {
  const router = useRouter();

  return (
    <div className="border rounded-md">
      <Table className="text-center">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Exam Title</TableHead>
            <TableHead className="text-center">Course</TableHead>
            <TableHead className="text-center">Date Ended</TableHead>
            <TableHead className="text-center">Submissions</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exams.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No exams found.
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
                {formatEndedOn(exam.endedOn)}
              </TableCell>
              <TableCell className="font-medium text-black">
                {exam.submissions.submitted} / {exam.submissions.total}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(exam.status)}>
                  {exam.status}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-center gap-2">
                {exam.status === "Grading Complete" ? (
                  <Button
                    size="sm"
                    onClick={() => {
                      toast.success(`Results shared for ${exam.title}`);
                    }}
                  >
                    Share Results
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() =>
                      router.push(`/dashboard/professor/review-exam/${exam.id}`)
                    }
                  >
                    Review Exam
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
