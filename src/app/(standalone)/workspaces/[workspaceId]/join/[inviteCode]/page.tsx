import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/actions";
import { getWorkspaceInfo } from "@/features/workspace/actions";
import { JoinWorkspaceForm } from "@/features/workspace/components/JoinWorkspaceForm";

type Props = {
  params: {
    workspaceId: string;
    inviteCode: string;
  };
};

async function WorkspaceIdJoinPage({ params }: Props) {
  const user = await getCurrent();

  if (!user) return redirect("/sign-in");

  const workspace = await getWorkspaceInfo({ workspaceId: params.workspaceId });

  if (!workspace) return redirect("/");

  return (
    <div className="w-full h-full lg:max-w-xl">
      <JoinWorkspaceForm
        inviteCode={params.inviteCode}
        workspaceId={params.workspaceId}
        workspaceName={workspace?.name || ""}
      />
    </div>
  );
}

export default WorkspaceIdJoinPage;
