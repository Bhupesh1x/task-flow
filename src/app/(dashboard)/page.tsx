import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/actions";
import { CreateWorkspaceForm } from "@/features/workspace/components/CreateWorkspaceForm";

export default async function Home() {
  const user = await getCurrent();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="p-4 bg-neutral-500">
      <CreateWorkspaceForm />
    </div>
  );
}
