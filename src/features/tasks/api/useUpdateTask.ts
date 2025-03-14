import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)[":taskId"]["$patch"]
>;

export function useUpdateTask() {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.tasks[":taskId"]["$patch"]({
        json,
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      return await response.json();
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Internal server error");
    },
    onSuccess: async ({ data }) => {
      toast.success("Task updated");

      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      await queryClient.invalidateQueries({
        queryKey: ["workspace-analytics"],
      });
      await queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      await queryClient.invalidateQueries({
        queryKey: ["task", data.$id],
      });
    },
  });

  return mutation;
}
