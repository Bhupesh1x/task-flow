import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/actions";
import { getProject } from "@/features/projects/actions";
import { UpdateProjectForm } from "@/features/projects/components/UpdateProjectForm";

type Props = {
  params: {
    projectId: string;
  };
};

async function ProjectIdSettingPage({ params }: Props) {
  const user = await getCurrent();

  if (!user) return redirect("/sign-in");

  const project = await getProject({ projectId: params.projectId });

  if (!project) return redirect("/");

  return (
    <div className="w-full lg:max-w-xl">
      <UpdateProjectForm initialValues={project} />
    </div>
  );
}

export default ProjectIdSettingPage;
