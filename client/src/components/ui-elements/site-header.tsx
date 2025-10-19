"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export function SiteHeader() {
  const { userName } = useAuth();
  const toTitleCase = (str: string) =>
    str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const displayName = userName ? toTitleCase(userName) : "";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="flex w-full items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="hidden h-6 sm:block" />
        <h1
          className={cn(
            "font-semibold tracking-tight mr-auto",
            "text-lg sm:text-xl md:text-2xl lg:text-3xl"
          )}
        >
          Welcome, {displayName}
        </h1>
      </div>
    </header>
  );
}
