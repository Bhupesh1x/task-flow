"use client";

import { useCreateProjectModal } from "../hooks/useCreateProjectModal";

import { ResponsiveModal } from "@/components/ResponsiveModal";

import { CreateProjectForm } from "./CreateProjectForm";

export function CreateProjectModal() {
  const { isOpen, setIsOpen, close } = useCreateProjectModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateProjectForm onCancel={close} />
    </ResponsiveModal>
  );
}
