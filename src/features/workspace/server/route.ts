import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";

import {
  MEMBERS_ID,
  DATABASE_ID,
  WORKSPACES_ID,
  IMAGES_BUCKET_ID,
} from "@/config";
import { generateInviteCode } from "@/lib/utils";
import { sessionMiddleware } from "@/lib/sessionMiddleware";

import { MemberRole } from "@/features/member/types";

import { workspaceSchema } from "../schema";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const database = c.get("databases");
    const user = c.get("user");

    const members = await database.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members.total === 0) {
      return c.json({ data: { documents: [], total: 0 } });
    }

    const workspaceIds = members?.documents?.map(
      (member) => member.workspaceId
    );

    const workspaces = await database.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
    );

    return c.json({ data: workspaces });
  })
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", workspaceSchema),
    async (c) => {
      const database = c.get("databases");
      const user = c.get("user");
      const storage = c.get("storage");

      const { name, image } = c.req.valid("form");

      let uploadedImageUrl;

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        const imagePreview = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          imagePreview
        ).toString("base64")}`;
      }

      const workspace = await database.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          image: uploadedImageUrl,
          inviteCode: generateInviteCode(6),
        }
      );

      await database.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: MemberRole.ADMIN,
      });

      return c.json({ data: workspace });
    }
  );

export default app;
