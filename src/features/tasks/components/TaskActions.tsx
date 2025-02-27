import { ExternalLinkIcon, Pencil, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  id: string;
  projectId: string;
  children: React.ReactNode;
};

export function TaskActions({ id, projectId, children }: Props) {
  return (
    <div className="flex justify-end">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="font-medium p-[10px]">
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem className="font-medium p-[10px]">
            <ExternalLinkIcon className="size-4 mr-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem className="font-medium p-[10px]">
            <Pencil className="size-4 mr-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem className="font-medium p-[10px] text-amber-700 focus:text-amber-700">
            <Trash className="size-4 mr-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
