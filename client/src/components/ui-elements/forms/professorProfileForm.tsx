"use client";
import React, { useState } from "react";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export default function ProfessorProfileForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    universityName: "",
    employeeId: "",
    department: "",
    designation: "",
    employmentType: "",
    joiningDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={submit} className="space-y-4">
        <FieldGroup>
          <FieldGroup className="flex flex-col sm:flex-row gap-2 items-stretch">
            <Field>
              <FieldLabel>University Name</FieldLabel>
              <Input
                name="universityName"
                value={formData.universityName}
                onChange={handleChange}
                required
              />
            </Field>

            <Field>
              <FieldLabel>Employee ID / Faculty Code</FieldLabel>
              <Input
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                required
              />
            </Field>
          </FieldGroup>

          <FieldGroup className="flex flex-col sm:flex-row gap-2 items-stretch">
            <Field>
              <FieldLabel>Department / Subject Area</FieldLabel>
              <Input
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </Field>

            <Field>
              <FieldLabel>Designation</FieldLabel>
              <Input
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Asst. Prof / HOD / Visiting"
                required
              />
            </Field>
          </FieldGroup>

          <FieldGroup className="flex flex-col sm:flex-row gap-2 items-stretch">
            <Field>
              <FieldLabel htmlFor="joiningDate">Joining Date</FieldLabel>
              <div className="relative">
                <Input
                  id="joiningDate"
                  name="joiningDate"
                  type="date"
                  value={
                    formData.joiningDate
                      ? new Date(
                          formData.joiningDate.split("-").reverse().join("-")
                        )
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) => {
                    const formattedDate = formatDate(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      startYear: formattedDate,
                    }));
                  }}
                  onClick={() =>
                    (
                      document.getElementById("joiningDate") as HTMLInputElement
                    )?.showPicker?.()
                  }
                  className="pr-8"
                  required
                />
              </div>
            </Field>
            <Field>
              <FieldLabel>Employment Type</FieldLabel>
              <Select
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
}
