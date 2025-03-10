import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/actions";
import { TaskClient } from "@/features/tasks/components/TaskClient";

type Props = {
  params: {
    workspaceId: string;
    taskId: string;
  };
};

async function TaskIdPage({ params }: Props) {
  const user = await getCurrent();

  if (!user) return redirect("/sign-in");

  return <TaskClient taskId={params.taskId} workspaceId={params.workspaceId} />;
}

export default TaskIdPage;
