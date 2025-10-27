"use client"
import {
  statCards,
  activeExams,
  recentActivity,
  draftExams,
  gradedExams,
} from "@/lib/data";
import { StatCards } from "@/components/ui-elements/professorDash/statCards";
import { ExamsTabs } from "@/components/ui-elements/professorDash/examTabs";
import { RecentActivityCard } from "@/components/ui-elements/professorDash/recentActivityCard";
import { QuickActionsCard } from "@/components/ui-elements/professorDash/quickActionsCard";
import { Button } from "@/components/ui/button";
import { File, History, NotebookPen } from "lucide-react";
import { useRouter } from "next/navigation";
export default function ProfessorDashboardPage() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Welcome, John Doe!</h1>
            <p className="text-sm text-muted-foreground">
              Let's help you create exams
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.push("/exams/take")}>
              <NotebookPen className="mr-2 h-4 w-4" /> Create Exam
            </Button>
            <Button variant="outline" onClick={() => router.push("/results")}>
              <File className="mr-2 h-4 w-4" /> Review Exam
            </Button>
            <Button variant="outline" onClick={() => router.push("/history")}>
              <History className="mr-2 h-4 w-4" /> Exam History
            </Button>
          </div>
        </div>

        <StatCards items={statCards} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
          <div className="md:col-span-2">
            <ExamsTabs
              activeExams={activeExams}
              draftExams={draftExams}
              gradedExams={gradedExams}
            />
          </div>
          <div className="md:col-span-1 flex flex-col gap-4">
            <RecentActivityCard activities={recentActivity} />
            <QuickActionsCard />
          </div>
        </div>
      </main>
    </div>
  );
}
