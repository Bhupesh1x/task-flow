import { Models } from "node-appwrite";

export type WorkspaceType = Models.Document & {
  name: string;
  image: string;
  userId: string;
  inviteCode: string;
};
