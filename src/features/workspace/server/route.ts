import { Hono } from "hono";
import { ID } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";

import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACES_ID } from "@/config";
import { sessionMiddleware } from "@/lib/sessionMiddleware";

import { workspaceSchema } from "../schema";

const app = new Hono().post(
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
      }
    );

    return c.json({ data: workspace });
  }
);

export default app;
