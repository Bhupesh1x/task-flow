"use client";

import { Fragment } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MoreHorizontal } from "lucide-react";

import { useGetMembers } from "@/features/member/api/useGetMembers";
import { useUpdateMember } from "@/features/member/api/useUpdateMember";
import { useDeleteMember } from "@/features/member/api/useDeleteMember";
import { useWorkspaceId } from "@/features/workspace/hooks/useWorkspaceId";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DottedSeprator } from "@/components/DottedSeprator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { MemberRole } from "../types";
import { MemberAvatar } from "./MemberAvatar";

export function MembersList() {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { data } = useGetMembers({ workspaceId });

  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();
  const { mutate: deleteMember, isPending: isDeletingMember } =
    useDeleteMember();

  function onDelete(memberId: string) {
    deleteMember({
      param: { memberId },
    });
  }

  function onUpdate(memberId: string, role: MemberRole) {
    updateMember({
      param: { memberId },
      json: { role },
    });
  }

  return (
    <Card>
      <CardHeader className="p-7">
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push(`/workspaces/${workspaceId}`)}
          >
            <ArrowLeft />
            Back
          </Button>
          <CardTitle className="text-lg font-bold">Members List</CardTitle>
        </div>
      </CardHeader>
      <div className="px-7">
        <DottedSeprator className="py-4" />
      </div>
      <CardContent className="p-7">
        {data?.documents?.map((member, index) => (
          <Fragment key={member.$id}>
            <div className="flex items-center gap-2">
              <MemberAvatar name={member.name} />
              <div className="flex flex-col">
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="ml-auto">
                    <MoreHorizontal className="size-5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom">
                  <DropdownMenuItem
                    onClick={() => onUpdate(member.$id, MemberRole.ADMIN)}
                    disabled={isUpdatingMember}
                    className="cursor-pointer"
                  >
                    Set as Administrator
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onUpdate(member.$id, MemberRole.MEMBER)}
                    disabled={isUpdatingMember}
                    className="cursor-pointer"
                  >
                    Set as Member
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(member.$id)}
                    disabled={isDeletingMember}
                    className="cursor-pointer text-amber-700"
                  >
                    Remove {member.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {index !== data?.documents?.length - 1 ? (
              <div className="my-2 h-[0.5px] w-full bg-neutral-300" />
            ) : null}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
}
