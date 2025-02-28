import { parseAsString, useQueryState } from "nuqs";

export function useUpdateTaskModal() {
  const [taskId, setTaskId] = useQueryState("edit-task", parseAsString);

  const open = (id: string) => setTaskId(id);
  const close = () => setTaskId(null);

  return {
    taskId,
    setTaskId,
    open,
    close,
  };
}
