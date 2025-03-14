import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type Props = {
  taskId: string;
};

export function useGetTask({ taskId }: Props) {
  const query = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const response = await client.api.tasks[":taskId"].$get({
        param: {
          taskId,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch task");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
}
