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

export type ReviewExams = {
  id: string;
  title: string;
  course: string;
  conductedOn: Date;
  submissions: { submitted: number; total: number };
  status: "Grading Complete" | "Pending Grading";
};

interface ReviewExamProps {
  exams: ReviewExams[];
}

function formatConductedOn(date: Date) {
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getStatusVariant(status: ReviewExams["status"]) {
  return status === "Grading Complete" ? "default" : "secondary";
}

export function ReviewExam({ exams }: ReviewExamProps) {
  const router = useRouter();

  return (
    <div className="border rounded-md">
      <Table className="text-center">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Exam Title</TableHead>
            <TableHead className="text-center">Course</TableHead>
            <TableHead className="text-center">Conducted On</TableHead>
            <TableHead className="text-center">Submissions</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exams.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-8"
              >
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
                {formatConductedOn(exam.conductedOn)}
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
                {exam.status === "Pending Grading" ? (
                  <Button
                    size="sm"
                    onClick={() =>
                      router.push(`/dashboard/professor/review-exam/${exam.id}`)
                    }
                  >
                    Grade
                  </Button>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        router.push(
                          `/dashboard/professor/review-exam/${exam.id}`,
                        )
                      }
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        toast.success(`Results shared for ${exam.title}`)
                      }
                    >
                      Share Results
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
