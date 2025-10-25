import {
  statCards,
  activeExams,
  recentActivity,
  draftExams, 
  gradedExams,
} from "@/lib/data";
import { StatCards } from "@/components/ui-elements/professorDash/statCards"
import { ExamsTabs } from "@/components/ui-elements/professorDash/examTabs";
import { RecentActivityCard } from "@/components/ui-elements/professorDash/recentActivityCard";
import { QuickActionsCard } from "@/components/ui-elements/professorDash/quickActionsCard";

export default function ProfessorDashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
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
