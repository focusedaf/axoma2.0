"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createProfile, editProfile } from "@/lib/api";

interface ProfessorProfile {
  universityName?: string;
  collegeName?: string;
  department?: string;
  designation?: string;
  employmentType?: string;
  joiningYear?: string;
}

interface ProfessorProfileFormProps {
  className?: string;
  existingData?: ProfessorProfile;
  onSuccess?: () => void;
}

export default function ProfessorProfileForm({
  className,
  existingData,
  onSuccess,
}: ProfessorProfileFormProps) {
  const [formData, setFormData] = useState<ProfessorProfile>({
    universityName: "",
    collegeName: "",
    department: "",
    designation: "",
    employmentType: "",
    joiningYear: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (existingData) setFormData(existingData);
  }, [existingData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        universityName: formData.universityName,
        collegeName: formData.collegeName,
        department: formData.department,
        designation: formData.designation,
        employmentType: formData.employmentType,
        joiningYear: Number(formData.joiningYear),
      };

      let res;

      try {
        res = await createProfile(payload);
        toast.success("Profile saved successfully!");
      } catch (err: any) {
        if (err?.response?.status === 409) {
          res = await editProfile(payload);
          toast.success("Profile updated successfully!");
        } else {
          throw err;
        }
      }

      setFormData(res.data.data);

      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error saving profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-8 w-full md:max-w-7xl", className)}>
      <form onSubmit={handleSubmit} id="profile-form">
        <FieldGroup className="flex flex-col sm:flex-row gap-2 justify-between items-stretch">
          <Field className="w-full max-w-xl">
            <FieldLabel>University Name</FieldLabel>
            <Input
              name="universityName"
              value={formData.universityName}
              onChange={handleChange}
              required
            />
          </Field>
          <Field className="w-full max-w-xl">
            <FieldLabel>College Name</FieldLabel>
            <Input
              name="collegeName"
              value={formData.collegeName}
              onChange={handleChange}
              required
            />
          </Field>
        </FieldGroup>

        <FieldGroup className="flex flex-col sm:flex-row gap-2 justify-between items-stretch">
          <Field className="w-full max-w-xl">
            <FieldLabel>Department</FieldLabel>
            <Input
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </Field>
          <Field className="w-full max-w-xl">
            <FieldLabel>Designation</FieldLabel>
            <Input
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required
            />
          </Field>
        </FieldGroup>

        <FieldGroup className="flex flex-col sm:flex-row gap-2 justify-between items-stretch">
          <Field className="w-full max-w-xl">
            <FieldLabel>Joining Year</FieldLabel>
            <Input
              name="joiningYear"
              value={formData.joiningYear}
              onChange={handleChange}
              pattern="\d{4}"
              required
            />
          </Field>
          <Field className="w-full max-w-xl">
            <FieldLabel>Employment Type</FieldLabel>
            <Select
              value={formData.employmentType}
              onValueChange={(val) =>
                setFormData((prev) => ({ ...prev, employmentType: val }))
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full_time">Full-time</SelectItem>
                <SelectItem value="visiting">Visiting</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
