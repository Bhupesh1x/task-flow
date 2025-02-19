import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/actions";
import { getWorkspace } from "@/features/workspace/actions";
import { UpdateWorkspaceForm } from "@/features/workspace/components/UpdateWorkspaceForm";

type Props = {
  params: {
    workspaceId: string;
  };
};

async function WorkspaceIdSettingPage({ params }: Props) {
  const user = await getCurrent();

  if (!user) return redirect("/sign-in");

  const workspace = await getWorkspace({ workspaceId: params.workspaceId });

  if (!workspace) return redirect(`/workspaces/${params.workspaceId}`);

  return (
    <div className="w-full lg:max-w-xl">
      <UpdateWorkspaceForm initialValues={workspace} />
    </div>
  );
}

export default WorkspaceIdSettingPage;
