import { Models } from "node-appwrite";

export type ProjectType = Models.Document & {
  name: string;
  image: string;
  workspaceId: string;
};
