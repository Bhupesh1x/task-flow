import { useRouter } from "next/navigation";
import { ExternalLinkIcon, Pencil, Trash } from "lucide-react";

import { useConfirm } from "@/hooks/useConfirm";

import { useDeleteTask } from "@/features/tasks/api/useDeleteTask";
import { useWorkspaceId } from "@/features/workspace/hooks/useWorkspaceId";
import { useUpdateTaskModal } from "@/features/tasks/hooks/useUpdateTaskModal";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  id: string;
  projectId: string;
  children: React.ReactNode;
};

export function TaskActions({ id, projectId, children }: Props) {
  const workspaceId = useWorkspaceId();
  const { mutate: deleteTask, isPending: isDeletingPending } = useDeleteTask();

  const router = useRouter();

  const { open } = useUpdateTaskModal();

  const [DeleteTaskDialog, onConfirm] = useConfirm(
    "Delete task?",
    "This action cannot be undone",
    "destructive"
  );

  async function onDelete() {
    const ok = await onConfirm();

    if (!ok) return;

    deleteTask({ param: { taskId: id } });
  }

  function onProjectDetails() {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
  }

  function onTaskDetails() {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${id}`);
  }

  return (
    <div className="flex justify-end">
      <DeleteTaskDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            className="font-medium p-[10px]"
            onClick={onTaskDetails}
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem
            className="font-medium p-[10px]"
            onClick={onProjectDetails}
          >
            <ExternalLinkIcon className="size-4 mr-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem
            className="font-medium p-[10px]"
            onClick={() => open(id)}
          >
            <Pencil className="size-4 mr-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            className="font-medium p-[10px] text-amber-700 focus:text-amber-700"
            onClick={onDelete}
            disabled={isDeletingPending}
          >
            <Trash className="size-4 mr-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
