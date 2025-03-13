import { Models } from "node-appwrite";

export enum MemberRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export type MemberType = Models.Document & {
  userId: string;
  workspaceId: string;
  role: MemberRole;
  name: string;
};
