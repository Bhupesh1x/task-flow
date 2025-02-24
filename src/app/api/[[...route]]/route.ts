import { Hono } from "hono";
import { handle } from "hono/vercel";

import auth from "@/features/auth/server/route";
import tasks from "@/features/tasks/server/route";
import member from "@/features/member/server/route";
import projects from "@/features/projects/server/route";
import workspaces from "@/features/workspace/server/route";

const app = new Hono().basePath("/api");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route("/auth", auth)
  .route("/tasks", tasks)
  .route("/members", member)
  .route("/projects", projects)
  .route("/workspaces", workspaces);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
