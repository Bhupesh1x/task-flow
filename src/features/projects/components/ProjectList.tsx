import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { useWorkspaceId } from "@/features/workspace/hooks/useWorkspaceId";
import { ProjectAvatar } from "@/features/projects/components/ProjectAvatar";
import { useCreateProjectModal } from "@/features/projects/hooks/useCreateProjectModal";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DottedSeprator } from "@/components/DottedSeprator";

import { ProjectType } from "../types";

type Props = {
  projects: ProjectType[] | [];
  total: number;
};

export function ProjectList({ projects, total }: Props) {
  const workspaceId = useWorkspaceId();
  const { open } = useCreateProjectModal();

  return (
    <div className="bg-muted rounded-lg w-full p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Projects ({total})</h3>
        <Button variant="secondary" size="sm" onClick={open}>
          <PlusIcon className="size-4" />
        </Button>
      </div>

      <DottedSeprator className="my-4" />

      <ul
        className={`grid grid-cols-1 gap-2 ${
          total > 0 ? "lg:grid-cols-2" : "lg:grid-cols-2"
        }`}
      >
        {projects?.map((project) => (
          <li key={project.$id}>
            <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
              <Card className="hover:opacity-75 transition shadow-none rounded-lg">
                <CardContent className="p-2 flex items-center gap-x-1.5">
                  <ProjectAvatar
                    image={project?.image}
                    name={project?.name}
                    className="!size-10"
                    fallbackClassName="!text-lg"
                  />
                  <p className="font-medium truncate">{project?.name}</p>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
        <li className="text-center text-sm text-muted-foreground w-full hidden first-of-type:block">
          No projects found
        </li>
      </ul>
    </div>
  );
}
