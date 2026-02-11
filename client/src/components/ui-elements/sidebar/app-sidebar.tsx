"use client";

import * as React from "react";
import {
  IconSend,
  IconUsers,
  IconHistory,
  IconWallet,
  IconHome,
  IconSquare,
} from "@tabler/icons-react";
import { NavMain } from "@/components/ui-elements/sidebar/nav-main";
import { NavUser } from "@/components/ui-elements/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";

const data = {
  navMain: {
    common: [{ title: "Home", url: "/", icon: IconHome }],
    professor: [
      {
        title: "Create Exams",
        url: "/dashboard/professor/create-exam",
        icon: IconSend,
      },
      {
        title: "Review Exams",
        url: "/dashboard/professor/review-exam",
        icon: IconUsers,
      },
      {
        title: "Exam History",
        url: "/dashboard/professor/history",
        icon: IconHistory,
      },
    ],
    student: [
      { title: "Exams", url: "/dashboard/student/exams", icon: IconSend },
      { title: "Results", url: "/dashboard/student/results", icon: IconWallet },
      {
        title: "History",
        url: "/dashboard/student/history",
        icon: IconHistory,
      },
    ],
  },
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const userRole = user?.role as "professor" | "student" | undefined;

  const roleDashboard =
    userRole === "student"
      ? { title: "Dashboard", url: "/dashboard/student", icon: IconSquare }
      : userRole === "professor"
        ? { title: "Dashboard", url: "/dashboard/professor", icon: IconSquare }
        : null;

  const items = [
    ...data.navMain.common,
    ...(roleDashboard ? [roleDashboard] : []),
    ...(userRole ? data.navMain[userRole] : []),
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="p-4 border-b">
        <span className="font-semibold text-3xl ">Axoma</span>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <NavMain items={items} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
