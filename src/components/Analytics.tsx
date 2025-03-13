"use client";

import { ProjectAnalyticsType } from "@/features/projects/api/useGetProjectAnalytics";

import { AnalyticsCard } from "@/components/AnalyticsCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type Props = {
  data: ProjectAnalyticsType;
};

export function Analytics({ data }: Props) {
  return (
    <ScrollArea className="mt-6">
      <div className="flex items-center gap-x-2">
        <AnalyticsCard
          title="Total tasks"
          variant={data?.tasksDifference > 0 ? "up" : "down"}
          value={data?.taskCount}
          increaseValue={data?.tasksDifference}
        />
        <AnalyticsCard
          title="Assigned tasks"
          variant={data?.assignedTasksDifference > 0 ? "up" : "down"}
          value={data?.assignedTaskCount}
          increaseValue={data?.assignedTasksDifference}
        />
        <AnalyticsCard
          title="Completed tasks"
          variant={data?.completedTasksDifference > 0 ? "up" : "down"}
          value={data?.completedTaskCount}
          increaseValue={data?.completedTasksDifference}
        />
        <AnalyticsCard
          title="Incomplete tasks"
          variant={data?.incompleteTasksDifference > 0 ? "up" : "down"}
          value={data?.incompleteTaskCount}
          increaseValue={data?.incompleteTasksDifference}
        />
        <AnalyticsCard
          title="Overdue tasks"
          variant={data?.overdueTasksDifference > 0 ? "up" : "down"}
          value={data?.overdueTaskCount}
          increaseValue={data?.overdueTasksDifference}
        />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
