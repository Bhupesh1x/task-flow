import { InferResponseType } from "hono";
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type Props = {
  workspaceId: string;
};

export type WorkspaceAnalyticsType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["analytics"]["$get"],
  200
>["data"];

export function useGetWorkspaceAnalytics({ workspaceId }: Props) {
  const query = useQuery({
    queryKey: ["workspace-analytics", workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[":workspaceId"][
        "analytics"
      ].$get({
        param: { workspaceId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch workspace analytics");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
}
