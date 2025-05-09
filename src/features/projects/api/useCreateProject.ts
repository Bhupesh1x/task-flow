import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.projects)["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.projects)["$post"]
>["form"];

export function useCreateProject() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (form) => {
      const response = await client.api.projects["$post"]({ form });

      if (!response.ok) {
        throw new Error("Failed to create project.");
      }

      return await response.json();
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Internal server error");
    },
    onSuccess: async ({ data }) => {
      toast.success("Project created");
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      router.push(`/workspaces/${data.workspaceId}/projects/${data.$id}`);
    },
  });

  return mutation;
}
