import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/actions";
import { TaskSwitcher } from "@/features/tasks/components/TaskSwitcher";

async function TasksPage() {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");

  return (
    <div className="flex flex-col h-full">
      <TaskSwitcher />
    </div>
  );
}

export default TasksPage;
