"use client";

import { usePathname } from "next/navigation";

import { UserButton } from "@/features/auth/components/UserButton";

import { MobileSidebar } from "./MobileSidebar";

const pathNameMap = {
  tasks: {
    title: "My Tasks",
    description: "View all of your tasks here",
  },
  projects: {
    title: "My Project",
    description: "View all of the project details here",
  },
};

const defaultMap = {
  title: "Home",
  description: "Monitor all of your projects and tasks here",
};

export const Navbar = () => {
  const pathname = usePathname();

  const pathnameParts = pathname.split("/");

  const pathnameKey = pathnameParts[3] as keyof typeof pathNameMap;

  const { title, description } = pathNameMap[pathnameKey] || defaultMap;

  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <div className="hidden lg:flex flex-col">
        <h1 className="tetx-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <MobileSidebar />
      <UserButton />
    </nav>
  );
};
