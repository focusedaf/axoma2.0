"use client";
import React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const StudentProfileForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    universityName: "",
    collegeName: "",
    majorName: "",
    currentSem: "",
    startYear: "",
    gradYear: "",
  });

 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      toast.success("Profile created successfully!");
    } catch (error: any) {
      setIsLoading(false);
      toast.error(
        error?.response?.data?.message || "Error in setting up profile"
      );
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <FieldGroup className="flex flex-col sm:flex-row gap-2 items-stretch">
            <Field>
              <FieldLabel htmlFor="universityName">University Name</FieldLabel>
              <Input
                id="universityName"
                name="universityName"
                type="text"
                placeholder="mumbai uni"
                value={formData.universityName}
                onChange={handleInputChange}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="collegeName">College Name</FieldLabel>
              <Input
                id="collegeName"
                name="collegeName"
                type="text"
                placeholder="ssjcoe"
                value={formData.collegeName}
                onChange={handleInputChange}
                required
              />
            </Field>
          </FieldGroup>

          <FieldGroup className="flex flex-col sm:flex-row gap-2 items-stretch">
            <Field>
              <FieldLabel htmlFor="majorName">Major Name</FieldLabel>
              <Input
                id="majorName"
                name="majorName"
                type="text"
                placeholder="CE"
                value={formData.majorName}
                onChange={handleInputChange}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="currentSem">Current Semester</FieldLabel>
              <Input
                id="currentSem"
                name="currentSem"
                type="text"
                placeholder="five"
                value={formData.currentSem}
                onChange={handleInputChange}
                required
              />
            </Field>
          </FieldGroup>

          <FieldGroup className="flex flex-col sm:flex-row gap-2 items-stretch">
            <Field>
              <FieldLabel htmlFor="startYear">Batch Start Year</FieldLabel>
              <div className="relative">
                <Input
                  id="startYear"
                  name="startYear"
                  type="text"
                  placeholder="YYYY"
                  value={formData.startYear}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="gradYear">
                Expected Graduation Year
              </FieldLabel>
              <div className="relative">
                <Input
                  id="gradYear"
                  name="gradYear"
                  type="text"
                  placeholder="YYYY"
                  value={formData.gradYear}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </Field>
          </FieldGroup>

          <Field className="flex items-center">
            <Button
              type="submit"
              disabled={isLoading}
              className="max-w-[150px]"
            >
              {isLoading ? (
                <Spinner />
              ) : (
                <span className="flex items-center gap-4">Submit</span>
              )}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
};

export default StudentProfileForm;
