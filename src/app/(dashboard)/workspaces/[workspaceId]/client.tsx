"use client";

import { useGetMembers } from "@/features/member/api/useGetMembers";
import { useGetProjects } from "@/features/projects/api/useGetProjects";
import { useGetWorkspaceAnalytics } from "@/features/workspace/api/useGetWorkspaceAnalytics";

import { Analytics } from "@/components/Analytics";
import { PageLoader } from "@/components/PageLoader";
import { ProjectList } from "@/features/projects/components/ProjectList";
import { HomePageMemberList } from "@/features/member/components/HomePageMemberList";

type Props = {
  workspaceId: string;
};

export function WorkspacePageClient({ workspaceId }: Props) {
  const { data: workspaceAnalytics, isLoading: workspaceAnalyticsLoading } =
    useGetWorkspaceAnalytics({
      workspaceId,
    });

  const { data: projects, isLoading: projectsLoading } = useGetProjects({
    workspaceId,
  });

  const { data: members, isLoading: membersLoading } = useGetMembers({
    workspaceId,
  });

  const isLoading =
    membersLoading || workspaceAnalyticsLoading || projectsLoading;

  if (isLoading) {
    return (
      <div className="h-[75vh] flex flex-col space-y-4">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      {workspaceAnalytics ? <Analytics data={workspaceAnalytics} /> : null}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ProjectList
          projects={projects?.documents ?? []}
          total={projects?.total ?? 0}
        />
        <HomePageMemberList
          members={members?.documents ?? []}
          total={members?.total ?? 0}
        />
      </div>
    </div>
  );
}
