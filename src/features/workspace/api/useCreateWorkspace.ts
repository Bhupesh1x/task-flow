import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<(typeof client.api.workspaces)["$post"]>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)["$post"]
>["form"];

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (form) => {
      const response = await client.api.workspaces["$post"]({ form });

      if (!response.ok) {
        throw new Error("Failed to create workspace.");
      }

      return await response.json();
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Internal server error");
    },
    onSuccess: async () => {
      toast.success("Workspace created");
      await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });

  return mutation;
}
