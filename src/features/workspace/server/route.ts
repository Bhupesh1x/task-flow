import { Hono } from "hono";
import { ID } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";

import { DATABASE_ID, WORKSPACES_ID } from "@/config";
import { sessionMiddleware } from "@/lib/sessionMiddleware";

import { workspaceSchema } from "../schema";

const app = new Hono().post(
  "/",
  sessionMiddleware,
  zValidator("json", workspaceSchema),
  async (c) => {
    const database = c.get("databases");
    const user = c.get("user");

    const { name } = c.req.valid("json");

    const workspace = await database.createDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      ID.unique(),
      {
        name,
        userId: user.$id,
      }
    );

    return c.json({ data: workspace });
  }
);

export default app;
