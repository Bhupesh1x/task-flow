import { UserButton } from "@/features/auth/components/UserButton";

import { MobileSidebar } from "./MobileSidebar";

export const Navbar = () => {
  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <div className="hidden lg:flex flex-col">
        <h1 className="tetx-2xl font-semibold">Home</h1>
        <p className="text-muted-foreground">
          Monitor all of your projects and tasks here
        </p>
      </div>
      <MobileSidebar />
      <UserButton />
    </nav>
  );
};
