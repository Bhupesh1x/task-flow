import { useRouter } from "next/navigation";

import { TaskStatus } from "@/features/tasks/types";
import { MemberType } from "@/features/member/types";
import { ProjectType } from "@/features/projects/types";
import { MemberAvatar } from "@/features/member/components/MemberAvatar";
import { useWorkspaceId } from "@/features/workspace/hooks/useWorkspaceId";
import { ProjectAvatar } from "@/features/projects/components/ProjectAvatar";

type Props = {
  id: string;
  title: string;
  status: TaskStatus;
  project: ProjectType;
  assignee: MemberType;
};

const statusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: "border-l-purple-500",
  [TaskStatus.TODO]: "border-l-red-500",
  [TaskStatus.IN_PROGRESS]: "border-l-yellow-500",
  [TaskStatus.IN_REVIEW]: "border-l-blue-500",
  [TaskStatus.DONE]: "border-l-emerald-500",
};

export function EventCard({ id, title, project, assignee, status }: Props) {
  const workspaceId = useWorkspaceId();

  const router = useRouter();

  function onClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();

    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  }

  return (
    <div className="px-2">
      <div
        onClick={onClick}
        className={`p-1.5 text-xs bg-white text-primary border rounded-md border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition ${statusColorMap[status]}`}
      >
        {title}
        <div className="flex items-center gap-x-1">
          <MemberAvatar
            name={assignee?.name}
            className="size-6"
            fallbackClassName="text-sm"
          />
          <div className="size-1 rounded-full bg-neutral-300" />
          <ProjectAvatar name={project?.name} image={project?.image} />
        </div>
      </div>
    </div>
  );
}
