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
import StudentHistoryPage from "../dashboard/student/history/page";
import StudentExamPage from "../dashboard/student/exams/page";
import StudentResultsPage from "../dashboard/student/results/page";
import ProfessorExamHistoryPage from "../dashboard/professor/history/page";
import ReviewExamPage from "../dashboard/professor/review-exam/page";
import CreateExamPage from "../dashboard/professor/create-exam/page";
import ProfessorDashboardPage from "../dashboard/professor/page";
import StudentDashboardPage from "../dashboard/student/page";
const page = () => {
  return (
    <div>
      {/* <StudentDashboardPage/> */}
      {/* <ProfessorDashboardPage/> */}
      {/* <CreateExamPage/> */}
      {/* <ReviewExamPage/> */}
      {/* <ProfessorExamHistoryPage/> */}
      {/* <StudentResultsPage/> */}
      {/* <StudentHistoryPage /> */}
      {/* <StudentExamPage /> */}
      <Navbar/>
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
