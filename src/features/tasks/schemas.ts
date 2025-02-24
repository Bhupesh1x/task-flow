import { z } from "zod";

import { TaskStatus } from "./types";

export const taskSchema = z.object({
  name: z.string().trim().min(1, "required"),
  workspaceId: z.string().trim().min(1, "required"),
  projectId: z.string().trim().min(1, "required"),
  assigneeId: z.string().trim().min(1, "required"),
  description: z.string().optional(),
  dueDate: z.coerce.date(),
  status: z.nativeEnum(TaskStatus, { required_error: "required" }),
});
