"use client";
import React, { ReactNode } from "react";
import { AppSidebar } from "@/components/ui-elements/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "../ui-elements/site-header";
import AL from "./AuthLayout";
interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
}

const DL: React.FC<DashboardLayoutProps> = ({ children, className }) => {
  return (
    <AL>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="overflow-hidden">
          <SiteHeader />
          <div
            className={`flex flex-1 flex-col gap-4 p-4 pt-0 overflow-hidden ${
              className || ""
            }`}
          >
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AL>
  );
};

export default DL;
