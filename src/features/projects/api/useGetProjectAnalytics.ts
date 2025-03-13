import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type Props = {
  projectId: string;
};

export function useGetProjectAnalytics({ projectId }: Props) {
  const query = useQuery({
    queryKey: ["project-analytics", projectId],
    queryFn: async () => {
      const response = await client.api.projects[":projectId"][
        "analytics"
      ].$get({
        param: { projectId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch project analytics");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
}
