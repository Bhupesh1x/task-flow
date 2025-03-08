import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  CircleIcon,
  PlusIcon,
} from "lucide-react";

import { snakeCaseToTitleCase } from "@/lib/utils";

import { TaskStatus } from "@/features/tasks/types";
import { useCreateTaskModal } from "@/features/tasks/hooks/useCreateTaskModal";

import { Button } from "@/components/ui/button";

type Props = {
  board: TaskStatus;
  taskCount: number;
};

const titleIconMap: Record<TaskStatus, React.ReactNode> = {
  BACKLOG: <CircleDashedIcon className="size-[18px] text-purple-400" />,
  TODO: <CircleIcon className="size-[18px] text-red-400" />,
  IN_PROGRESS: <CircleDotDashedIcon className="size-[18px] text-yellow-400" />,
  IN_REVIEW: <CircleDotIcon className="size-[18px] text-blue-400" />,
  DONE: <CircleCheckIcon className="size-[18px] text-emerald-400" />,
};

export function KanbanHeader({ board, taskCount }: Props) {
  const { open } = useCreateTaskModal();

  return (
    <div className="py-1.5 px-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {titleIconMap[board]}
        <h3 className="font-semibold text-sm">{snakeCaseToTitleCase(board)}</h3>
        <p className="size-5 flex items-center justify-center bg-neutral-200 text-neutral-700 font-medium text-xs rounded-md">
          {taskCount}
        </p>
      </div>
      <Button variant="ghost" size="icon" onClick={open} className="size-5">
        <PlusIcon className="size-4 text-neutral-500" />
      </Button>
    </div>
  );
}
