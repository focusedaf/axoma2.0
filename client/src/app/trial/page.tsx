import React from "react";
import Metamask from "@/components/ui-elements/buttons/Metamask";
import RoleSelector from "@/components/ui-elements/roleSelector";
import Footer from "@/components/ui-elements/landing/footer";
import ProfessorProfileForm from "@/components/ui-elements/forms/professorProfileForm";
import StudentProfileForm from "@/components/ui-elements/forms/studentProfileForm";
import { Progress } from "@/components/ui/progress";
import VerifyDocsForm from "@/components/ui-elements/forms/verifyDocs-form";
import { AppSidebar } from "@/components/ui-elements/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/ui-elements/site-header";
import Navbar from "@/components/ui-elements/landing/navbar";
import {
  ExamSchedule,
  type Exam,
} from "@/components/ui-elements/studentDash/examSchedule";
import { ExamTabs } from "@/components/ui-elements/studentDash/examTabs";
import StudentHistoryPage from "../dashboard/student/history/page";
import StudentExamPage from "../dashboard/student/exams/page";
import StudentResultsPage from "../dashboard/student/results/page";
const page = () => {
  return (
    <div>
      <StudentResultsPage/>
      {/* <StudentHistoryPage /> */}
      {/* <StudentExamPage /> */}
      {/* <Navbar/> */}
      {/* <SidebarProvider>
        <SiteHeader />
        <AppSidebar />
      </SidebarProvider> */}
      {/* <VerifyDocsForm/> */}
      {/* <StudentProfileForm/>
      <ProfessorProfileForm/> */}
      {/* <Progress/> */}
      {/* <Footer /> */}
      {/* <Metamask />
      <RoleSelector /> */}
    </div>
  );
};

export default page;
