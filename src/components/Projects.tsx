"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";

import { useGetProjects } from "@/features/projects/api/useGetProjects";
import { useWorkspaceId } from "@/features/workspace/hooks/useWorkspaceId";
import { ProjectAvatar } from "@/features/projects/components/ProjectAvatar";
import { useCreateProjectModal } from "@/features/projects/hooks/useCreateProjectModal";

export function Projects() {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();
  const { data } = useGetProjects({ workspaceId });

  const { open } = useCreateProjectModal();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <p className="uppercase text-neutral-500 text-xs">Projects</p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>

      <div>
        {data?.documents?.map((project) => {
          const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
          const isActive = pathname === href;
          return (
            <Link href={href} key={project.$id}>
              <div
                className={`flex items-center gap-2.5 p-2.5 rounded-md text-neutral-500 hover:opacity-75 transition cursor-pointer ${
                  isActive ? "bg-white opacity-100 tetx-primary shadow-sm" : ""
                }`}
              >
                <ProjectAvatar name={project.name} image={project.image} />
                <span>{project.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
