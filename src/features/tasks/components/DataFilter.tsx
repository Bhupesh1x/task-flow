"use client";

import { useMemo } from "react";
import { FolderIcon, ListChecksIcon, UserIcon } from "lucide-react";

import { useGetMembers } from "@/features/member/api/useGetMembers";
import { useGetProjects } from "@/features/projects/api/useGetProjects";
import { useWorkspaceId } from "@/features/workspace/hooks/useWorkspaceId";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

import { TaskStatus } from "../types";
import { useTaskFilters } from "../hooks/useTaskFilters";

type Props = {
  hideProjectFilter?: boolean;
};

export function DataFilter({ hideProjectFilter }: Props) {
  const workspaceId = useWorkspaceId();
  const { data: members, isLoading: isMembersLoading } = useGetMembers({
    workspaceId,
  });
  const { data: projects, isLoading: isProjectsLoading } = useGetProjects({
    workspaceId,
  });

  const [{ assigneeId, dueDate, projectId, status }, setFilters] =
    useTaskFilters();

  const isLoading = isMembersLoading || isProjectsLoading;

  const projectOptions = useMemo(() => {
    if (!projects?.total) return [];

    return projects?.documents?.map((project) => ({
      id: project.$id,
      name: project.name,
      imageUrl: project.imageUrl,
    }));
  }, [projects]);

  const memberOptions = useMemo(() => {
    if (!members?.total) return [];

    return members?.documents?.map((member) => ({
      id: member.$id,
      name: member.name,
    }));
  }, [members]);

  function onStatusChange(value: string) {
    setFilters({ status: value === "all" ? null : (value as TaskStatus) });
  }

  function onAssigneeChange(value: string) {
    setFilters({ assigneeId: value === "all" ? null : (value as string) });
  }

  function onProjectChange(value: string) {
    setFilters({ projectId: value === "all" ? null : (value as string) });
  }

  function onDueDateChange(value: Date) {
    setFilters({ dueDate: value ? value.toISOString() : undefined });
  }

  if (isLoading) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select
        defaultValue={status ?? undefined}
        onValueChange={(value) => onStatusChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListChecksIcon className="size-4 mr-2" />
            <SelectValue placeholder="All Statuses" />
          </div>
        </SelectTrigger>
        <SelectContent className="w-full lg:w-auto">
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
          <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
        </SelectContent>
      </Select>

      <Select
        defaultValue={assigneeId ?? undefined}
        onValueChange={(value) => onAssigneeChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <UserIcon className="size-4 mr-2" />
            <SelectValue placeholder="All Assignees" />
          </div>
        </SelectTrigger>
        <SelectContent className="w-full lg:w-auto">
          <SelectItem value="all">All Assignees</SelectItem>
          <SelectSeparator />
          {memberOptions?.map((member) => (
            <SelectItem value={member.id} key={member.id}>
              {member.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!hideProjectFilter ? (
        <Select
          defaultValue={projectId ?? undefined}
          onValueChange={(value) => onProjectChange(value)}
        >
          <SelectTrigger className="w-full lg:w-auto h-8">
            <div className="flex items-center pr-2">
              <FolderIcon className="size-4 mr-2" />
              <SelectValue placeholder="All Projects" />
            </div>
          </SelectTrigger>
          <SelectContent className="w-full lg:w-auto">
            <SelectItem value="all">All Projects</SelectItem>
            <SelectSeparator />
            {projectOptions?.map((project) => (
              <SelectItem value={project.id} key={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}

      <DatePicker
        placeholder="Due date"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={onDueDateChange}
        className="h-8 w-full lg:w-auto"
      />
    </div>
  );
}
