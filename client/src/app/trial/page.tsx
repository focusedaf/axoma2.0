import React from "react";
import Metamask from "@/components/ui-elements/buttons/Metamask";
import RoleSelector from "@/components/ui-elements/roleSelector";
const page = () => {
  return (
    <div>
      <Metamask />
        <RoleSelector/>
    </div>
  );
};

export default page;
