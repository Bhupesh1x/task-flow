import { MoreHorizontalIcon } from "lucide-react";

import { Task } from "@/features/tasks/types";
import { TaskDate } from "@/features/tasks/components/TaskDate";
import { TaskActions } from "@/features/tasks/components/TaskActions";
import { MemberAvatar } from "@/features/member/components/MemberAvatar";
import { ProjectAvatar } from "@/features/projects/components/ProjectAvatar";

import { DottedSeprator } from "@/components/DottedSeprator";

type Props = {
  task: Task;
};

export function KanbanCard({ task }: Props) {
  return (
    <div className="bg-white p-2.5 py-1.5 mb-1.5 rounded shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-x-2">
        <p className="text-sm line-clamp-2">{task.name}</p>
        <TaskActions id={task.$id} projectId={task.projectId}>
          <MoreHorizontalIcon className="size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" />
        </TaskActions>
      </div>
      <DottedSeprator />

      <div className="flex items-center gap-x-1.5">
        <MemberAvatar
          name={task?.assignee?.name}
          className="size-6"
          fallbackClassName="text-xs"
        />
        <div className="size-1 rounded-full bg-neutral-500" />
        <TaskDate dueDate={task?.dueDate} className="text-sm" />
      </div>
      <div className="flex items-center gap-x-1.5">
        <ProjectAvatar
          image={task?.project?.image}
          name={task?.project?.name}
          fallbackClassName="text-xs"
        />
        <p>{task?.project?.name}</p>
      </div>
    </div>
  );
}
