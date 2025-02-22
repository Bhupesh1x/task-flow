import { DATABASE_ID, PROJECTS_ID } from "@/config";
import { createSessionClient } from "@/lib/appwrite";

import { ProjectType } from "./types";
import { getMember } from "../member/utils";

type GetProjectProp = {
  projectId: string;
};

export async function getProject({ projectId }: GetProjectProp) {
  try {
    const { databases, account } = await createSessionClient();

    const user = await account.get();

    const project = await databases.getDocument<ProjectType>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId: project.workspaceId,
    });

    if (!member) {
      return null;
    }

    return project;
  } catch {
    return null;
  }
}
