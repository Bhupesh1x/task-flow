export enum MemberRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export type MemberType = {
  userId: string;
  workspaceId: string;
  role: MemberRole;
  name: string;
};
