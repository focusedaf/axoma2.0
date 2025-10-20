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
const page = () => {
  return (
    <div>
      {/* <SidebarProvider><AppSidebar/></SidebarProvider> */}
      {/* <VerifyDocsForm/> */}
      <StudentProfileForm/>
      <ProfessorProfileForm/>
        {/* <Progress/> */}
      {/* <Footer /> */}
      {/* <Metamask />
      <RoleSelector /> */}
    </div>
  );
};

export default page;
