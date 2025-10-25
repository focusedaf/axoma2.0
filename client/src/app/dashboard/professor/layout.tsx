"use client";
import React, { ReactNode } from "react";
import DL from "@/components/layout/DashboardLayout"; 

interface ProfessorLayoutProps {
  children: ReactNode;
}

export default function ProfessorLayout({ children }: ProfessorLayoutProps) {
  return (
    <div className="min-h-screen w-full overflow-y-auto bg-background text-white">
      <DL className="h-full w-full">{children}</DL>
    </div>
  );
}
