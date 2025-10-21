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
  user: {
    name: "morpheus",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: {
    common: [
      { title: "Home", url: "/", icon: IconHome },
      { title: "Dashboard", url: "/dashboard", icon: IconSquare },
    ],
    professor: [
      { title: "Create Exams", url: "/dashboard/create-exam", icon: IconSend },
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
  const { userRole } = useAuth();

  const items = [
    ...(data.navMain.common || []),
    ...(userRole && data.navMain[userRole as "professor" | "student"]
      ? data.navMain[userRole as "professor" | "student"]
      : []),
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="flex flex-col items-center justify-center gap-2 p-4 border-b border-white/10">
        <div className="flex items-center justify-start w-full px-2 py-1">
          <span className="font-semibold text-lg">Axoma</span>
        </div>
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
