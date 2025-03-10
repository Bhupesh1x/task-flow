"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ChevronRightIcon, TrashIcon } from "lucide-react";

import { useConfirm } from "@/hooks/useConfirm";

import { Task } from "@/features/tasks/types";
import { useDeleteTask } from "@/features/tasks/api/useDeleteTask";
import { ProjectAvatar } from "@/features/projects/components/ProjectAvatar";

import { Button } from "@/components/ui/button";

type Props = {
  task: Task;
};

export function TaskBreadCrumb({ task }: Props) {
  const router = useRouter();

  const { mutate, isPending } = useDeleteTask();

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete task?",
    "This action cannot be undone",
    "destructive"
  );

  async function onDelete() {
    const ok = await confirm();

    if (!ok) return;

    try {
      mutate(
        { param: { taskId: task.$id } },
        {
          onSuccess: () => {
            router.replace(`/workspaces/${task.workspaceId}/tasks`);
          },
        }
      );
    } catch {
      toast.error("Failed to delete task");
    }
  }

  return (
    <div className="flex items-center justify-between w-full">
      <ConfirmDialog />
      <div className="flex items-center gap-x-3">
        <ProjectAvatar
          name={task?.project?.name}
          image={task?.project?.image}
          className="size-6 md:size-8"
        />
        <Link
          className="flex items-center gap-2"
          href={`/workspaces/${task.workspaceId}/projects/${task.projectId}`}
        >
          <p className="text-muted-foreground text-sm lg:text-lg font-semibold hover:opacity-75 transition">
            {task?.project?.name || "Name"}
          </p>
        </Link>

        <ChevronRightIcon className="size-4 lg:size-5 text-muted-foreground" />

        <p className="font-semibold text-sm lg:text-lg">{task?.name}</p>
      </div>

      <Button
        variant="destructive"
        size="sm"
        disabled={isPending}
        onClick={onDelete}
      >
        <TrashIcon className="size-4" />
        <p className="hidden md:block">Delete Task</p>
      </Button>
    </div>
  );
}
