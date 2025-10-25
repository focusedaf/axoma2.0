import { FileCheck2, Upload, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QuickActionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Button variant="outline" className="w-full justify-start gap-2">
          <FileCheck2 className="h-4 w-4" />
          Review Pending Submissions
        </Button>
        <Button variant="outline" className="w-full justify-start gap-2">
          <Upload className="h-4 w-4" />
          Publish Grades
        </Button>
        <Button variant="outline" className="w-full justify-start gap-2">
          <Clock className="h-4 w-4" />
          Exam History
        </Button>
      </CardContent>
    </Card>
  );
}
