"use client";
import * as React from "react";
import {
  IconSend,
  IconUsers,
  IconX,
  IconHistory,
  IconSquare,
  IconHome,
  IconWallet,
  IconShield,
} from "@tabler/icons-react";
import { NavMain } from "@/components/ui-elements/sidebar/nav-main";
import { NavUser } from "@/components/ui-elements/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";


const data = {
  user: {
    name: "morpheus",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    { title: "Home", url: "/", icon: IconHome },
    { title: "Dashboard", url: "/dashboard", icon: IconSquare },
   
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="flex flex-col items-center justify-center gap-2 p-4 border-b border-white/10">
        <div className="flex items-center justify-start w-full px-2 py-1">
          {/* <div className="flex items-center">
            <Back />
          </div> */}
          <span className="font-semibold text-lg">Axoma</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
