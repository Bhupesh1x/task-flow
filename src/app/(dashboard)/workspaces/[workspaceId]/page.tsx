import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/actions";

import { WorkspacePageClient } from "./client";

type Props = {
  params: {
    workspaceId: string;
  };
};

async function WorkspacePage({ params }: Props) {
  const user = await getCurrent();

  if (!user) {
    redirect("/sign-in");
  }

  return <WorkspacePageClient workspaceId={params.workspaceId} />;
}

export default WorkspacePage;
