import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoleSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

const RoleSelector = ({ value, onChange, disabled }: RoleSelectorProps) => {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select your role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="student">Student</SelectItem>
        <SelectItem value="professor">Professor</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default RoleSelector;
