"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Eye, History, NotebookPen } from "lucide-react";

export function SiteHeader() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();

  if (isLoggedIn === null) return null;
  if (!isLoggedIn || !user) return null;

  const userRole = user.role;
  const displayName = user.name || "User";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="flex w-full items-center gap-4 px-4 py-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="hidden h-6 sm:block" />

        <h1
          className={cn(
            "font-semibold tracking-tight mr-auto text-black",
            "text-lg sm:text-xl md:text-3xl",
          )}
        >
          Welcome, {displayName}
        </h1>

        {userRole === "professor" && (
          <div className="flex gap-2">
            <Button
              onClick={() => router.push("/dashboard/professor/create-exam")}
            >
              <NotebookPen className="mr-2 h-4 w-4" /> Create Exam
            </Button>

            <Button
              variant="outline"
              className="text-black"
              onClick={() => router.push("/dashboard/professor/history")}
            >
              <Eye className="mr-2 h-4 w-4" /> View History
            </Button>

            <Button
              variant="outline"
              className="text-black"
              onClick={() => router.push("/dashboard/professor/review-exam")}
            >
              <History className="mr-2 h-4 w-4" />
              Review Exam
            </Button>
          </div>
        )}

        {userRole === "student" && (
          <div className="flex gap-2">
            <Button onClick={() => router.push("/dashboard/student/exams")}>
              <NotebookPen className="mr-2 h-4 w-4" /> Take Exam
            </Button>

            <Button
              variant="outline"
              className="text-black"
              onClick={() => router.push("/dashboard/student/results")}
            >
              <Eye className="mr-2 h-4 w-4" /> View Results
            </Button>

            <Button
              variant="outline"
              className="text-black"
              onClick={() => router.push("/dashboard/student/history")}
            >
              <History className="mr-2 h-4 w-4" />
              Exam History
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
