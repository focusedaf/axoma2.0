"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
          <Button
            onClick={() => router.push("/dashboard/professor/create-exam")}
          >
            Create Exam
          </Button>
        )}

        {userRole === "student" && (
          <div className="flex gap-2">
            <Button onClick={() => router.push("/dashboard/student/take-exam")}>
              Take Exam
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/student/results")}
            >
              View Results
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/student/history")}
            >
              Exam History
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
