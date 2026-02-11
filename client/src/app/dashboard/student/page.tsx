"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye, History, NotebookPen } from "lucide-react";
import { studentStats, upcomingExams, recentResults } from "@/lib/data";
import { PerformanceOverviewCard } from "@/components/ui-elements/studentDash/percentOverviewCard";
import { UpcomingExamsCard } from "@/components/ui-elements/studentDash/upcomingExamsCard";
import { RecentResultsCard } from "@/components/ui-elements/studentDash/recentResultsCard";

export default function StudentDashboardPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl text-muted-foreground">
              Let's get you ready for your exams
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.push("/exams/take")}>
              <NotebookPen className="mr-2 h-4 w-4" /> Take Exam
            </Button>
            <Button variant="outline" onClick={() => router.push("/results")}>
              <Eye className="mr-2 h-4 w-4" /> View Results
            </Button>
            <Button variant="outline" onClick={() => router.push("/history")}>
              <History className="mr-2 h-4 w-4" /> Exam History
            </Button>
          </div>
        </div>

        <PerformanceOverviewCard stats={studentStats} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
          <UpcomingExamsCard exams={upcomingExams} />
          <RecentResultsCard results={recentResults} />
        </div>
      </main>
    </div>
  );
}
