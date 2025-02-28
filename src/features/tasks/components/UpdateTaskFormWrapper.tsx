"use client";

import { useMemo } from "react";
import { Loader2 } from "lucide-react";

import { useGetTask } from "@/features/tasks/api/useGetTask";
import { useGetMembers } from "@/features/member/api/useGetMembers";
import { useGetProjects } from "@/features/projects/api/useGetProjects";
import { useWorkspaceId } from "@/features/workspace/hooks/useWorkspaceId";

import { Card, CardContent } from "@/components/ui/card";

import { UpdateTaskForm } from "./UpdateTaskForm";

type Props = {
  onCancel?: () => void;
  taskId: string;
};

export function UpdateTaskFormWrapper({ taskId, onCancel }: Props) {
  const workspaceId = useWorkspaceId();

  const { data: projects, isLoading: isProjectsLoading } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isMembersLoading } = useGetMembers({
    workspaceId,
  });

  const { data: initialValues, isLoading: isInitialValuesLoading } = useGetTask(
    {
      taskId,
    }
  );

  const isLoading =
    isProjectsLoading || isMembersLoading || isInitialValuesLoading;

  const projectOptions = useMemo(() => {
    if (!projects?.total) return [];

    return projects?.documents?.map((project) => ({
      id: project.$id,
      name: project.name,
      imageUrl: project.image,
    }));
  }, [projects]);

  const memberOptions = useMemo(() => {
    if (!members?.total) return [];

    return members?.documents?.map((member) => ({
      id: member.$id,
      name: member.name,
    }));
  }, [members]);

  if (isLoading) {
    return (
      <Card className="h-[600px] border-none shadow-none w-full">
        <CardContent className="h-full w-full flex flex-col items-center justify-center">
          <Loader2 className="h-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!initialValues) {
    return null;
  }

  return (
    <div>
      <UpdateTaskForm
        onCancel={onCancel}
        projectOptions={projectOptions}
        memberOptions={memberOptions}
        initialValues={initialValues}
      />
    </div>
  );
}
