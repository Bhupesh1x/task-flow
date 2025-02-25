import { z } from "zod";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";

import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/sessionMiddleware";
import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from "@/config";

import { getMember } from "@/features/member/utils";

import { TaskStatus } from "../types";
import { taskSchema } from "../schemas";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        status: z.nativeEnum(TaskStatus).nullish(),
        search: z.string().nullish(),
        dueDate: z.string().nullish(),
      })
    ),
    async (c) => {
      const { users } = await createAdminClient();
      const user = c.get("user");
      const databases = c.get("databases");

      const { projectId, workspaceId, assigneeId, search, status, dueDate } =
        c.req.valid("query");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        c.json({ error: "Unauthorized" }, 401);
      }

      const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ];

      if (projectId) {
        console.log("projectId: ", projectId);
        query.push(Query.equal("projectId", projectId));
      }

      if (assigneeId) {
        console.log("assigneeId: ", assigneeId);
        query.push(Query.equal("assigneeId", assigneeId));
      }

      if (status) {
        console.log("status: ", status);
        query.push(Query.equal("status", status));
      }

      if (dueDate) {
        console.log("dueDate: ", dueDate);
        query.push(Query.equal("dueDate", dueDate));
      }

      if (search) {
        console.log("search: ", search);
        query.push(Query.search("name", search));
      }

      const tasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, query);

      const projectIds = tasks.documents?.map((task) => task.projectId);
      const assigneeIds = tasks.documents?.map((task) => task.assigneeId);

      const projects = await databases.listDocuments(
        DATABASE_ID,
        PROJECTS_ID,
        projectIds.length > 0 ? [Query.contains("$id", projectIds)] : []
      );

      const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : []
      );

      const assignees = await Promise.all(
        members.documents?.map(async (member) => {
          const user = await users.get(member.$id);

          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        })
      );

      const populatedTasks = tasks.documents.map((task) => {
        const project = projects.documents.map(
          (project) => project.$id === task.projectId
        );

        const assignee = assignees.map(
          (assignee) => assignee.$id === task.assigneeId
        );

        return {
          ...task,
          project,
          assignee,
        };
      });

      return c.json({ data: { ...tasks, populatedTasks } });
    }
  )
  .post("/", sessionMiddleware, zValidator("json", taskSchema), async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const {
      name,
      assigneeId,
      dueDate,
      projectId,
      status,
      workspaceId,
      description,
    } = c.req.valid("json");

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const highestPositionTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", status),
        Query.orderAsc("position"),
        Query.limit(1),
      ]
    );

    const newPosition =
      highestPositionTask?.total > 0
        ? highestPositionTask?.documents[0]?.position + 1000
        : 1000;

    const task = await databases.createDocument(
      DATABASE_ID,
      TASKS_ID,
      ID.unique(),
      {
        name,
        status,
        assigneeId,
        projectId,
        workspaceId,
        dueDate,
        description,
        position: newPosition,
      }
    );

    return c.json({ data: task });
  });

export default app;
