import { z } from "zod";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";

import {
  MEMBERS_ID,
  DATABASE_ID,
  WORKSPACES_ID,
  IMAGES_BUCKET_ID,
  TASKS_ID,
} from "@/config";
import { generateInviteCode } from "@/lib/utils";
import { sessionMiddleware } from "@/lib/sessionMiddleware";

import { getMember } from "@/features/member/utils";
import { TaskStatus } from "@/features/tasks/types";
import { MemberRole } from "@/features/member/types";

import { updateWorkspaceSchema, workspaceSchema } from "../schema";

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
  )
  .patch(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("form", updateWorkspaceSchema),
    async (c) => {
      const { workspaceId } = c.req.param();
      const { name, image } = c.req.valid("form");

      const databases = c.get("databases");
      const user = c.get("user");

      const storage = c.get("storage");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user?.$id,
      });

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401);
      }

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
      } else {
        uploadedImageUrl = image;
      }

      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        {
          name,
          image: uploadedImageUrl ?? "",
        }
      );

      return c.json({ data: workspace });
    }
  )
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    const { workspaceId } = c.req.param();
    const user = c.get("user");
    const databases = c.get("databases");

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);

    return c.json({ data: { $id: workspaceId } });
  })
  .patch("/:workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
    const { workspaceId } = c.req.param();
    const user = c.get("user");
    const databases = c.get("databases");

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const workspace = await databases.updateDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId,
      {
        inviteCode: generateInviteCode(6),
      }
    );

    return c.json({ data: workspace });
  })
  .post(
    "/:workspaceId/join",
    sessionMiddleware,
    zValidator("json", z.object({ code: z.string() })),
    async (c) => {
      const { workspaceId } = c.req.param();
      const { code } = c.req.valid("json");

      const user = c.get("user");
      const databases = c.get("databases");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (member) {
        return c.json({ error: "Already a member" }, 400);
      }

      const workspace = await databases.getDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
      );

      if (workspace.inviteCode !== code) {
        return c.json({ error: "Invalid code" }, 400);
      }

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: MemberRole.MEMBER,
      });

      return c.json({ data: workspace });
    }
  )
  .get("/:workspaceId/analytics", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      workspaceId: workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const now = new Date();
    const thisMonthStartDate = startOfMonth(now);
    const thisMonthEndDate = endOfMonth(now);
    const lastMonthStartDate = startOfMonth(subMonths(now, 1));
    const lastMonthEndDate = endOfMonth(subMonths(now, 1));

    const thisMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", thisMonthStartDate.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEndDate.toISOString()),
        Query.select(["$id"]),
      ]
    );

    const lastMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", lastMonthStartDate.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEndDate.toISOString()),
        Query.select(["$id"]),
      ]
    );

    const taskCount = thisMonthTasks.total;
    const tasksDifference = taskCount - lastMonthTasks.total;

    const thisMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStartDate.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEndDate.toISOString()),
        Query.select(["$id"]),
      ]
    );

    const lastMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", lastMonthStartDate.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEndDate.toISOString()),
        Query.select(["$id"]),
      ]
    );

    const assignedTaskCount = thisMonthAssignedTasks.total;
    const assignedTasksDifference =
      assignedTaskCount - lastMonthAssignedTasks.total;

    const thisMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStartDate.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEndDate.toISOString()),
        Query.select(["$id"]),
      ]
    );

    const lastMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStartDate.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEndDate.toISOString()),
        Query.select(["$id"]),
      ]
    );

    const completedTaskCount = thisMonthCompletedTasks.total;
    const completedTasksDifference =
      completedTaskCount - lastMonthCompletedTasks.total;

    const thisMonthIncompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStartDate.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEndDate.toISOString()),
        Query.select(["$id"]),
      ]
    );

    const lastMonthIncompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStartDate.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEndDate.toISOString()),
        Query.select(["$id"]),
      ]
    );

    const incompleteTaskCount = thisMonthIncompleteTasks.total;
    const incompleteTasksDifference =
      incompleteTaskCount - lastMonthIncompleteTasks.total;

    const thisMonthOverdueTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", thisMonthStartDate.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEndDate.toISOString()),
        Query.select(["$id"]),
      ]
    );

    const lastMonthOverdueTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", lastMonthStartDate.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEndDate.toISOString()),
        Query.select(["$id"]),
      ]
    );

    const overdueTaskCount = thisMonthOverdueTasks.total;
    const overdueTasksDifference =
      overdueTaskCount - lastMonthOverdueTasks.total;

    return c.json({
      data: {
        taskCount,
        tasksDifference,
        assignedTaskCount,
        assignedTasksDifference,
        completedTaskCount,
        completedTasksDifference,
        incompleteTaskCount,
        incompleteTasksDifference,
        overdueTaskCount,
        overdueTasksDifference,
      },
    });
  });

export default app;
