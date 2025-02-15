"use client";

import { useRouter } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";

import { useWorkspaceId } from "@/features/workspace/hooks/useWorkspaceId";
import { useGetWorkspaces } from "@/features/workspace/api/useGetWorkspaces";
import { WorkspaceAvatar } from "@/features/workspace/components/WorkspaceAvatar";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "./ui/select";

export const WorkspaceSwitcher = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { data } = useGetWorkspaces();

  function onChange(id: string) {
    router.push(`/workspaces/${id}`);
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <p className="uppercase text-neutral-500 text-xs">Workspaces</p>
        <RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" />
      </div>

      <Select value={workspaceId} onValueChange={onChange}>
        <SelectTrigger className="bg-neutral-200 mt-2 font-medium p-1 w-full">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>
        <SelectContent>
          {data?.documents?.map((workspace) => (
            <SelectItem value={workspace.$id} key={workspace.$id}>
              <div className="flex items-center gap-2">
                <WorkspaceAvatar
                  name={workspace.name}
                  image={workspace.image}
                />
                <span>{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
