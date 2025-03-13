import Link from "next/link";
import { Settings } from "lucide-react";

import { useWorkspaceId } from "@/features/workspace/hooks/useWorkspaceId";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DottedSeprator } from "@/components/DottedSeprator";

import { MemberAvatar } from "./MemberAvatar";

import { MemberType } from "../types";

type Props = {
  members: MemberType[] | [];
  total: number;
};

export function HomePageMemberList({ members, total }: Props) {
  const workspaceId = useWorkspaceId();

  return (
    <div className="rounded-lg w-full border p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Members ({total})</h3>
        <Button variant="secondary" size="sm">
          <Link href={`/workspaces/${workspaceId}/members`}>
            <Settings className="size-4" />
          </Link>
        </Button>
      </div>

      <DottedSeprator className="my-4" />

      <ul className="grid grid-cols-1 gap-x-2 sm:grid-cols-2 2xl:grid-cols-3">
        {members?.map((member) => (
          <li key={member.$id}>
            <Card className="shadow-none rounded-lg overflow-hidden">
              <CardContent className="p-2 flex flex-col items-center gap-x-1.5">
                <MemberAvatar name={member.name} className="!size-12" />
                <div className="flex flex-col items-center overflow-hidden">
                  <p className="text-lg font-medium line-clamp-1">
                    {member?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {member?.email}
                  </p>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
        <li className="text-sm text-muted-foreground w-full hidden first-of-type:block">
          No members found
        </li>
      </ul>
    </div>
  );
}
