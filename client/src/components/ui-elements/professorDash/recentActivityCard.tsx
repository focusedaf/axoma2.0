import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityItem } from "@/lib/data";

interface RecentActivityCardProps {
  activities: ActivityItem[];
}

export function RecentActivityCard({ activities }: RecentActivityCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {activity.description}
            </p>
            <p className="text-sm text-muted-foreground whitespace-nowrap pl-4">
              {activity.time}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
