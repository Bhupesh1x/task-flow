"use client";

import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DottedSeprator } from "@/components/DottedSeprator";

import { useJoinWorkspace } from "../api/useJoinWorkspace";

type Props = {
  workspaceName: string;
  workspaceId: string;
  inviteCode: string;
};

export function JoinWorkspaceForm({
  inviteCode,
  workspaceId,
  workspaceName,
}: Props) {
  const router = useRouter();

  const { mutate, isPending } = useJoinWorkspace();

  function onJoin() {
    mutate({
      json: { code: inviteCode },
      param: {
        workspaceId,
      },
    });
  }

  return (
    <Card>
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join Workspace</CardTitle>
        <CardDescription>
          You&apos;ve been invited to join {workspaceName} workspace
        </CardDescription>
      </CardHeader>

      <div className="px-7">
        <DottedSeprator />
      </div>

      <CardContent className="p-7">
        <div className="flex flex-col lg:flex-row gap-2 justify-between items-center">
          <Button
            variant="secondary"
            className="w-full lg:w-fit"
            size="lg"
            onClick={() => router.push("/")}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            size="lg"
            className="w-full lg:w-fit"
            onClick={onJoin}
            disabled={isPending}
          >
            Join workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
