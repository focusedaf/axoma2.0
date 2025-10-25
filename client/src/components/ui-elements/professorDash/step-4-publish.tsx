"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface Step4PublishProps {}

export function Step4Publish(props: Step4PublishProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Ready to Publish?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>You're all set!</AlertTitle>
            <AlertDescription>
              Review all details in the "Preview" tab. Once published, the exam
              will be available to assigned students based on the schedule
              you've set.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
