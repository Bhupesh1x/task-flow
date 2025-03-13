import { useState } from "react";
import { PencilIcon, XIcon } from "lucide-react";

import { useUpdateTask } from "@/features/tasks/api/useUpdateTask";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DottedSeprator } from "@/components/DottedSeprator";

import { Task } from "../types";

type Props = {
  task: Task;
};

export function TaskDescription({ task }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.description);

  const { mutate, isPending } = useUpdateTask();

  function onSave() {
    if (!value?.trim()?.length) return;

    mutate(
      {
        json: { description: value },
        param: { taskId: task.$id },
      },
      {
        onSettled: () => {
          setIsEditing(false);
        },
      }
    );
  }

  return (
    <div className="rounded-lg border p-4 min-h-[12rem]">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Description</p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {isEditing ? (
            <XIcon className="size-4" />
          ) : (
            <PencilIcon className="size-4" />
          )}
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>
      <DottedSeprator className="my-3" />
      {isEditing ? (
        <div className="flex flex-col gap-y-4">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={4}
            disabled={isPending}
          />
          <Button
            size="sm"
            className="ml-auto"
            onClick={onSave}
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </div>
      ) : (
        <div>
          {task?.description ? (
            <p>{task.description}</p>
          ) : (
            <span className="text-muted-foreground">
              No description set yet
            </span>
          )}
        </div>
      )}
    </div>
  );
}
