import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<(typeof client.api.tasks)["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)["$post"]>["json"];

export function useCreateTask() {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.tasks["$post"]({ json });

      if (!response.ok) {
        throw new Error("Failed to create task.");
      }

      return await response.json();
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Internal server error");
    },
    onSuccess: async () => {
      toast.success("Task created");
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      await queryClient.invalidateQueries({
        queryKey: ["workspace-analytics"],
      });
      await queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
    },
  });

  return mutation;
}
