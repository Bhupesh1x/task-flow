import { z } from "zod";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";

import { sessionMiddleware } from "@/lib/sessionMiddleware";
import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID, TASKS_ID } from "@/config";

import { TaskStatus } from "@/features/tasks/types";
import { getMember } from "@/features/member/utils";

import { ProjectType } from "../types";
import { createProjectSchema, updateProjectSchema } from "../schemas";

const app = new Hono()
  .get(
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
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const storage = c.get("storage");

      const { name, image, workspaceId } = c.req.valid("form");

      const member = await getMember({
        workspaceId,
        databases,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unautorized" }, 401);
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
      }

      const project = await databases.createDocument(
        DATABASE_ID,
        PROJECTS_ID,
        ID.unique(),
        {
          name,
          image: uploadedImageUrl,
          workspaceId,
        }
      );

      return c.json({ data: project });
    }
  )
  .patch(
    "/:projectId",
    sessionMiddleware,
    zValidator("form", updateProjectSchema),
    async (c) => {
      const { projectId } = c.req.param();
      const { name, image } = c.req.valid("form");

      const databases = c.get("databases");
      const user = c.get("user");

      const storage = c.get("storage");

      const projectToUpdate = await databases.getDocument<ProjectType>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId
      );

      const member = await getMember({
        databases,
        userId: user?.$id,
        workspaceId: projectToUpdate.workspaceId,
      });

      if (!member) {
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

      const project = await databases.updateDocument(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
        {
          name,
          image: uploadedImageUrl ?? "",
        }
      );

      return c.json({ data: project });
    }
  )
  .delete("/:projectId", sessionMiddleware, async (c) => {
    const { projectId } = c.req.param();
    const user = c.get("user");
    const databases = c.get("databases");

    const projectToDelete = await databases.getDocument<ProjectType>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId: projectToDelete.workspaceId,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, projectId);

    return c.json({ data: { $id: projectToDelete.$id } });
  })
  .get("/:projectId/analytics", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { projectId } = c.req.param();

    const project = await databases.getDocument<ProjectType>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
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
        Query.equal("projectId", project.$id),
        Query.greaterThanEqual("createdAt", thisMonthStartDate.toISOString()),
        Query.lessThanEqual("createdAt", thisMonthEndDate.toISOString()),
        Query.select(["$id"]),
      ]
    );

    const lastMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", project.$id),
        Query.greaterThanEqual("createdAt", lastMonthStartDate.toISOString()),
        Query.lessThanEqual("createdAt", lastMonthEndDate.toISOString()),
        Query.select(["$id"]),
      ]
    );

    const taskCount = thisMonthTasks.total;
    const tasksDifference = taskCount - lastMonthTasks.total;

    const thisMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", project.$id),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("createdAt", thisMonthStartDate.toISOString()),
        Query.lessThanEqual("createdAt", thisMonthEndDate.toISOString()),
        Query.select(["$id"]),
      ]
    );

    const lastMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", project.$id),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("createdAt", lastMonthStartDate.toISOString()),
        Query.lessThanEqual("createdAt", lastMonthEndDate.toISOString()),
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
        Query.equal("projectId", project.$id),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("createdAt", thisMonthStartDate.toISOString()),
        Query.lessThanEqual("createdAt", thisMonthEndDate.toISOString()),
        Query.select(["$id"]),
      ]
    );

    const lastMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", project.$id),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("createdAt", lastMonthStartDate.toISOString()),
        Query.lessThanEqual("createdAt", lastMonthEndDate.toISOString()),
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
        Query.equal("projectId", project.$id),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("createdAt", thisMonthStartDate.toISOString()),
        Query.lessThanEqual("createdAt", thisMonthEndDate.toISOString()),
        Query.select(["$id"]),
      ]
    );

    const lastMonthIncompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", project.$id),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("createdAt", lastMonthStartDate.toISOString()),
        Query.lessThanEqual("createdAt", lastMonthEndDate.toISOString()),
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
        Query.equal("projectId", project.$id),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("createdAt", thisMonthStartDate.toISOString()),
        Query.lessThanEqual("createdAt", thisMonthEndDate.toISOString()),
        Query.select(["$id"]),
      ]
    );

    const lastMonthOverdueTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", project.$id),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("createdAt", lastMonthStartDate.toISOString()),
        Query.lessThanEqual("createdAt", lastMonthEndDate.toISOString()),
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
