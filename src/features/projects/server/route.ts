import { z } from "zod";
import { Hono } from "hono";
import { Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";

import { DATABASE_ID, PROJECTS_ID } from "@/config";
import { sessionMiddleware } from "@/lib/sessionMiddleware";

import { getMember } from "@/features/member/utils";

const app = new Hono().get(
  "/",
  sessionMiddleware,
  zValidator("query", z.object({ workspaceId: z.string() })),
  async (c) => {
    const { workspaceId } = c.req.valid("query");

    const user = c.get("user");
    const databases = c.get("databases");

    if (!workspaceId) {
      return c.json({ error: "Workspace id is required" }, 400);
    }

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 400);
    }

    const projects = await databases.listDocuments(DATABASE_ID, PROJECTS_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.orderDesc("$createdAt"),
    ]);

    return c.json({ data: projects });
  }
);

export default app;
