"use client";

import { redirect } from "next/navigation";

import { Task } from "@/features/tasks/types";
import { useGetTask } from "@/features/tasks/api/useGetTask";
import { TaskBreadCrumb } from "@/features/tasks/components/TaskBreadCrumb";

import { PageLoader } from "@/components/PageLoader";
import { DottedSeprator } from "@/components/DottedSeprator";

import { TaskOverview } from "./TaskOverview";
import { TaskDescription } from "./TaskDescription";

type Props = {
  taskId: string;
  workspaceId: string;
};

export function TaskClient({ taskId, workspaceId }: Props) {
  const { data: task, isLoading, isError } = useGetTask({ taskId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError) {
    return redirect(`/workspaces/${workspaceId}`);
  }

  return (
    <div className="flex flex-col">
      <TaskBreadCrumb task={task as Task} />
      <DottedSeprator className="my-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <TaskOverview task={task as Task} />
        <TaskDescription task={task as Task} />
      </div>
    </div>
  );
}
