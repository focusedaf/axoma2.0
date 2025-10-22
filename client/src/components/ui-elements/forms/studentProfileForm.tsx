"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { createProfile,editProfile } from "@/lib/api";

interface StudentProfile {
  universityName?: string;
  collegeName?: string;
  majorName?: string;
  currentSem?: string;
  startYear?: string;
  gradYear?: string;
}

const StudentProfileForm = ({
  className,
  existingData,
}: {
  className?: string;
  existingData?: StudentProfile;
}) => {
  const [formData, setFormData] = useState<StudentProfile>({
    universityName: "",
    collegeName: "",
    majorName: "",
    currentSem: "",
    startYear: "",
    gradYear: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (existingData) setFormData(existingData);
  }, [existingData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    <div className={cn("flex flex-col gap-6", className)}>
      <form onSubmit={handleSubmit}>
        <FieldGroup className="flex flex-col sm:flex-row gap-2 items-stretch">
          <Field>
            <FieldLabel htmlFor="universityName">University Name</FieldLabel>
            <Input
              id="universityName"
              name="universityName"
              value={formData.universityName}
              onChange={handleChange}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="collegeName">College Name</FieldLabel>
            <Input
              id="collegeName"
              name="collegeName"
              value={formData.collegeName}
              onChange={handleChange}
            />
          </Field>
        </FieldGroup>

        <FieldGroup className="flex flex-col sm:flex-row gap-2 items-stretch">
          <Field>
            <FieldLabel htmlFor="majorName">Major Name</FieldLabel>
            <Input
              id="majorName"
              name="majorName"
              value={formData.majorName}
              onChange={handleChange}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="currentSem">Current Semester</FieldLabel>
            <Input
              id="currentSem"
              name="currentSem"
              value={formData.currentSem}
              onChange={handleChange}
            />
          </Field>
        </FieldGroup>

        <FieldGroup className="flex flex-col sm:flex-row gap-2 items-stretch">
          <Field>
            <FieldLabel htmlFor="startYear">Batch Start Year</FieldLabel>
            <Input
              id="startYear"
              name="startYear"
              value={formData.startYear}
              onChange={handleChange}
              placeholder="YYYY"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="gradYear">Expected Graduation Year</FieldLabel>
            <Input
              id="gradYear"
              name="gradYear"
              value={formData.gradYear}
              onChange={handleChange}
              placeholder="YYYY"
            />
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
};

export default StudentProfileForm;
