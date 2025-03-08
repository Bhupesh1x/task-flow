"use client";

import { useCallback } from "react";
import { useQueryState } from "nuqs";
import { Loader2, PlusIcon } from "lucide-react";

import { useWorkspaceId } from "@/features/workspace/hooks/useWorkspaceId";

import { Button } from "@/components/ui/button";
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

export function TaskSwitcher() {
  const workspaceId = useWorkspaceId();
  const { open } = useCreateTaskModal();

  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });

  const [{ assigneeId, dueDate, projectId, search, status }] = useTaskFilters();

  const { data: tasks, isLoading: isTasksLoading } = useGetTasks({
    workspaceId,
    assigneeId,
    projectId,
    dueDate,
    search,
    status,
  });

  const { mutate: bulkUpdate } = useBulkUpdateTasks();

  const onKanbanChange = useCallback(
    (tasks: { $id: string; position: number; status: TaskStatus }[]) => {
      bulkUpdate({ json: { tasks } });
    },
    [bulkUpdate]
  );

  return (
    <div className="mt-4">
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
          <DataFilter />
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
                {JSON.stringify(tasks)}
              </TabsContent>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}
