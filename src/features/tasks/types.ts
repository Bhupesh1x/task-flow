import { Models } from "node-appwrite";

export enum TaskStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export type Task = Models.Document & {
  name: string;
  assigneeId: string;
  projectId: string;
  status: TaskStatus;
  position: number;
  dueDate: string;
  workspaceId: string;
  description?: string;
};
