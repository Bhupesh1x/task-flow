"use client";

import { Loader2, LogOut } from "lucide-react";

import { useLogout } from "../api/useLogout";
import { useCurrent } from "../api/useCurrent";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DottedSeprator } from "@/components/DottedSeprator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function UserButton() {
  const { mutate } = useLogout();
  const { data: user, isLoading } = useCurrent();

  if (isLoading) {
    return (
      <div className="size-10 bg-gray-200 border border-neutral-300 flex items-center justify-center rounded-full">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const { name, email } = user;

  const avatarFallback = name
    ? name?.charAt(0)?.toUpperCase()
    : email?.charAt(0)?.toUpperCase() ?? "U";

  function onLogout() {
    mutate();
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Avatar className="size-10 border border-neutral-300 hover:opacity-75 transition cursor-pointer">
          <AvatarFallback className="bg-neutral-200 text-neutral-500 font-medium flex items-center justify-center text-lg">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" side="bottom" sideOffset={10}>
        <div className="flex flex-col items-center justify-center px-2.5 py-4">
          <Avatar className="size-[52px] border border-neutral-300">
            <AvatarFallback className="bg-neutral-200 text-neutral-500 font-medium flex items-center justify-center text-xl">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>

          <h4 className="text-neutral-900 text-sm font-semibold">
            {name || "User"}
          </h4>
          <p className="text-neutral-500 text-xs">{email || ""}</p>
        </div>

        <DottedSeprator className="mb-1" />

        <DropdownMenuItem
          className="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer"
          onClick={onLogout}
        >
          <LogOut className="size-5 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
