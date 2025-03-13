"use client";

import { useCallback } from "react";
import { useQueryState } from "nuqs";
import { Loader2, PlusIcon } from "lucide-react";

import { useWorkspaceId } from "@/features/workspace/hooks/useWorkspaceId";
import { useGetProjectAnalytics } from "@/features/projects/api/useGetProjectAnalytics";

import { Button } from "@/components/ui/button";
import { Analytics } from "@/components/Analytics";
import { DataTable } from "@/components/DataTable";
import { DottedSeprator } from "@/components/DottedSeprator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useGetTasks } from "../api/useGetTasks";
import { useBulkUpdateTasks } from "../api/useBulkUpdateTasks";

import { useTaskFilters } from "../hooks/useTaskFilters";
import { useCreateTaskModal } from "../hooks/useCreateTaskModal";

import { TaskStatus } from "../types";
import { taskColumns } from "./columns";

import { DataKanban } from "./DataKanban";
import { DataFilter } from "./DataFilter";
import { DataCalender } from "./DataCalender";

type Props = {
  hideProjectFilter?: boolean;
  analyticsProjectId?: string;
  paramProjectId?: string;
};

export function TaskSwitcher({
  hideProjectFilter,
  analyticsProjectId,
  paramProjectId,
}: Props) {
  const workspaceId = useWorkspaceId();
  const { open } = useCreateTaskModal();

  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });

  const [{ assigneeId, dueDate, projectId, search, status }] = useTaskFilters();

  const { data: tasks, isLoading: isTasksLoading } = useGetTasks({
    workspaceId,
    assigneeId,
    projectId: paramProjectId ?? projectId,
    dueDate,
    search,
    status,
  });

  const { data: projectAnalytics, isLoading } = useGetProjectAnalytics({
    projectId: analyticsProjectId as string,
  });

  const { mutate: bulkUpdate } = useBulkUpdateTasks();

  const onKanbanChange = useCallback(
    (tasks: { $id: string; position: number; status: TaskStatus }[]) => {
      bulkUpdate({ json: { tasks } });
    },
    [bulkUpdate]
  );

  if (analyticsProjectId && isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="text-muted-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div className="mt-4">
      {analyticsProjectId && projectAnalytics ? (
        <div className="mb-4">
          <Analytics data={projectAnalytics} />
        </div>
      ) : null}

      <Tabs
        className="border w-full rounded-lg"
        defaultValue={view}
        onValueChange={setView}
      >
        <div className="h-full flex flex-col p-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-2">
            <TabsList className="w-full lg:w-auto">
              <TabsTrigger value="table" className="h-8 w-full lg:w-auto">
                Table
              </TabsTrigger>
              <TabsTrigger value="kanban" className="h-8 w-full lg:w-auto">
                Kanban
              </TabsTrigger>
              <TabsTrigger value="calender" className="w-full lg:w-auto h-8">
                Calender
              </TabsTrigger>
            </TabsList>
            <Button className="w-full lg:w-auto" size="sm" onClick={open}>
              <PlusIcon className="size-4" />
              New
            </Button>
          </div>

          <DottedSeprator className="py-4" />
          <DataFilter hideProjectFilter={hideProjectFilter} />
          <DottedSeprator className="py-4" />
          {isTasksLoading ? (
            <div className="h-[200px] w-full flex items-center justify-center border rounded-lg">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="overflow-auto">
              <TabsContent value="table" className="mt-0">
                <DataTable
                  data={tasks?.documents || []}
                  columns={taskColumns}
                />
              </TabsContent>
              <TabsContent value="kanban" className="mt-0">
                <DataKanban
                  data={tasks?.documents || []}
                  onChange={onKanbanChange}
                />
              </TabsContent>
              <TabsContent value="calender" className="mt-0">
                <DataCalender data={tasks?.documents || []} />
              </TabsContent>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}
