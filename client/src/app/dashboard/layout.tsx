import React, { ReactNode } from "react";
import DL from "@/components/layout/DashboardLayout";

interface DashProps {
  children: ReactNode;
}

const Dash: React.FC<DashProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full overflow-y-auto bg-background text-white">
      <DL className="h-full w-full">{children}</DL>
    </div>
  );
};

export default Dash;
