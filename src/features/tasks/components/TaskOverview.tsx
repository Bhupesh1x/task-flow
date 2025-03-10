import { PencilIcon } from "lucide-react";

import { useUpdateTaskModal } from "../hooks/useUpdateTaskModal";

import { snakeCaseToTitleCase } from "@/lib/utils";

import { MemberAvatar } from "@/features/member/components/MemberAvatar";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DottedSeprator } from "@/components/DottedSeprator";

import { Task } from "../types";

import { TaskDate } from "./TaskDate";
import { OverviewProperty } from "./OverviewProperty";

type Props = {
  task: Task;
};

export function TaskOverview({ task }: Props) {
  const { open } = useUpdateTaskModal();

  return (
    <div className="rounded-lg bg-muted p-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Overview</p>
        <Button variant="secondary" size="sm" onClick={() => open(task.$id)}>
          <PencilIcon className="size-4" />
          Edit
        </Button>
      </div>
      <DottedSeprator className="my-3" />
      <div className="flex flex-col gap-y-4">
        <OverviewProperty label="Assignee">
          <div className="flex items-center gap-2">
            <MemberAvatar name={task?.assignee?.name} className="size-6" />
            <p className="text-sm font-semibold">{task?.assignee?.name}</p>
          </div>
        </OverviewProperty>

        <OverviewProperty label="Due Date">
          <TaskDate dueDate={task?.dueDate} />
        </OverviewProperty>

        <OverviewProperty label="Status">
          <Badge variant={task?.status}>
            {snakeCaseToTitleCase(task?.status)}
          </Badge>
        </OverviewProperty>
      </div>
    </div>
  );
}
