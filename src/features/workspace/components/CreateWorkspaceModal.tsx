"use client";

import { useCreateWorkspaceModal } from "../hooks/useCreateWorkspaceModal";

import { ResponsiveModal } from "@/components/ResponsiveModal";

import { CreateWorkspaceForm } from "./CreateWorkspaceForm";

export function CreateWorkspaceModal() {
  const { isOpen, setIsOpen, close } = useCreateWorkspaceModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateWorkspaceForm onCancel={close} />
    </ResponsiveModal>
  );
}
