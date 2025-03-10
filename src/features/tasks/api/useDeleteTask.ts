import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)[":taskId"]["$delete"]
>;

export function useDeleteTask() {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType & { onSuccess?: (data?: ResponseType) => void }
  >({
    mutationFn: async ({ param }) => {
      const response = await client.api.tasks[":taskId"]["$delete"]({
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      return await response.json();
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Internal server error");
    },
    onSuccess: async ({ data }, variables) => {
      toast.success("Task deleted");

      // Call the onSuccess passed inside `mutate()`
      if (variables?.onSuccess) {
        variables.onSuccess({ data });
      }

      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      await queryClient.invalidateQueries({
        queryKey: ["task", data.$id],
      });
    },
  });

  return mutation;
}
