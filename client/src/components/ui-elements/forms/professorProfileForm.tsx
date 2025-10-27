"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import axios from "axios";
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

export default function ProfessorProfileForm({
  className,
  existingData,
}: {
  className?: string;
  existingData?: ProfessorProfile;
}) {
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
      let res;
      if (existingData) {
        res = await editProfile(formData);
        toast.success("Profile updated successfully!");
      } else {
        res = await createProfile(formData);
        toast.success("Profile created successfully!");
      }

      setFormData(res.data.data);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Error saving profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-8 space-x-10 w-full md:max-w-7xl",
        className
      )}
    >
      <form onSubmit={handleSubmit}>
        <FieldGroup className="flex flex-col sm:flex-row gap-2 justify-between items-stretch">
          <Field className="w-full max-w-xl">
            <FieldLabel>University Name</FieldLabel>
            <Input
              name="universityName"
              value={formData.universityName}
              onChange={handleChange}
            />
          </Field>
          <Field className="w-full max-w-xl">
            <FieldLabel>College Name</FieldLabel>
            <Input
              name="collegeName"
              value={formData.collegeName}
              onChange={handleChange}
            />
          </Field>
        </FieldGroup>

        <FieldGroup className="flex flex-col sm:flex-row gap-2 justify-between items-stretch">
          <Field className="w-full max-w-xl">
            <FieldLabel>Department / Subject Area</FieldLabel>
            <Input
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
          </Field>
          <Field className="w-full max-w-xl">
            <FieldLabel>Designation</FieldLabel>
            <Input
              name="designation"
              value={formData.designation}
              onChange={handleChange}
            />
          </Field>
        </FieldGroup>

        <FieldGroup className="flex flex-col sm:flex-row gap-2 justify-between items-stretch">
          <Field className="w-full max-w-xl">
            <FieldLabel>Joining Year</FieldLabel>
            <Input
              name="joiningYear"
              value={formData.joiningYear}
              placeholder="YYYY"
              onChange={handleChange}
            />
          </Field>
          <Field className="w-full max-w-xl">
            <FieldLabel>Employment Type</FieldLabel>
            <Select
              value={formData.employmentType}
              onValueChange={(val) =>
                setFormData((prev) => ({ ...prev, employmentType: val }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="visiting">Visiting</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>

        <Field className="flex items-center mt-4">
          <Button type="submit" disabled={isLoading} className="max-w-[150px]">
            {isLoading ? <Spinner /> : "Save"}
          </Button>
        </Field>
      </form>
    </div>
  );
}
