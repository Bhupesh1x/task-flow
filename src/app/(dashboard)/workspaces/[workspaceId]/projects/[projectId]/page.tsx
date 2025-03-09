import Link from "next/link";
import { Pencil } from "lucide-react";
import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/actions";
import { getProject } from "@/features/projects/actions";
import { TaskSwitcher } from "@/features/tasks/components/TaskSwitcher";
import { ProjectAvatar } from "@/features/projects/components/ProjectAvatar";

import { Button } from "@/components/ui/button";

type Props = {
  params: {
    projectId: string;
  };
};

async function ProjectIdPage({ params }: Props) {
  const user = await getCurrent();
  if (!user) return redirect("/sign-in");

  const project = await getProject({ projectId: params.projectId });

  if (!project) return redirect("/");

  return (
    <>
      <div className="h-full w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ProjectAvatar
            name={project.name}
            image={project.image}
            className="!size-10"
            fallbackClassName="!text-lg"
          />
          <p className="font-lg font-bold">{project.name}</p>
        </div>

        <Button variant="secondary" size="sm" className="font-bold" asChild>
          <Link
            href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}
          >
            <Pencil className="size-4" />
            Edit Project
          </Link>
        </Button>
      </div>
      <TaskSwitcher hideProjectFilter />
    </>
  );
}

export default ProjectIdPage;
