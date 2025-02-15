import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/actions";
import { getWorkspaces } from "@/features/workspace/actions";

export default async function Home() {
  const user = await getCurrent();

  if (!user) {
    redirect("/sign-in");
  }

  const workspaces = await getWorkspaces();

  if (workspaces.total === 0) {
    return redirect("/workspaces/create");
  } else {
    return redirect(`/workspaces/${workspaces.documents?.[0]?.$id}`);
  }
}
