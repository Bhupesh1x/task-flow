import { Query } from "node-appwrite";

import { createSessionClient } from "@/lib/appwrite";
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";

import { WorkspaceType } from "./types";
import { getMember } from "../member/utils";

export async function getWorkspaces() {
  try {
    const { account, databases } = await createSessionClient();

    const user = await account.get();

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members.total === 0) {
      return { documents: [], total: 0 };
    }

    const workspaceIds = members?.documents?.map(
      (member) => member.workspaceId
    );

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
    );

    return workspaces;
  } catch {
    return { documents: [], total: 0 };
  }
}

type GetWorkspaceProp = {
  workspaceId: string;
};

export async function getWorkspace({ workspaceId }: GetWorkspaceProp) {
  try {
    const { account, databases } = await createSessionClient();

    const user = await account.get();

    const member = getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });

    if (!member) {
      return null;
    }

    const workspace = await databases.getDocument<WorkspaceType>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    return workspace;
  } catch {
    return null;
  }
}

export async function getWorkspaceInfo({ workspaceId }: GetWorkspaceProp) {
  try {
    const { databases } = await createSessionClient();

    const workspace = await databases.getDocument<WorkspaceType>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    return { name: workspace.name };
  } catch {
    return null;
  }
}
