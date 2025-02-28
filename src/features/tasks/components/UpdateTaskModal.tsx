"use client";

import { useUpdateTaskModal } from "@/features/tasks/hooks/useUpdateTaskModal";

import { ResponsiveModal } from "@/components/ResponsiveModal";

import { UpdateTaskFormWrapper } from "./UpdateTaskFormWrapper";

export function UpdateTaskModal() {
  const { taskId, close } = useUpdateTaskModal();

  return (
    <ResponsiveModal open={!!taskId} onOpenChange={close}>
      {!!taskId ? (
        <UpdateTaskFormWrapper onCancel={close} taskId={taskId} />
      ) : null}
    </ResponsiveModal>
  );
}
