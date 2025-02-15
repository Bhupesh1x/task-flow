import Link from "next/link";
import Image from "next/image";

import { Navigation } from "./Navigation";
import { DottedSeprator } from "./DottedSeprator";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

export const Sidebar = () => {
  return (
    <aside className="h-full bg-neutral-100 p-4">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.svg" height={40} width={40} alt="logo" />
        <p className="text-2xl font-semibold">Task Flow</p>
      </Link>
      <DottedSeprator className="my-4" />
      <WorkspaceSwitcher />
      <DottedSeprator className="my-4" />

      <Navigation />
    </aside>
  );
};
