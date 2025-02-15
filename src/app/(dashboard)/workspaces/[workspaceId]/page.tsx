import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/actions";

async function WorkspacePage() {
  const user = await getCurrent();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div>
      <h1>Workspace Page</h1>
    </div>
  );
}

export default WorkspacePage;
