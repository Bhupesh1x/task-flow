import Link from "next/link";
import Image from "next/image";

import { UserButton } from "@/features/auth/components/UserButton";

type Props = {
  children: React.ReactNode;
};

function StandloneLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="max-w-screen-2xl mx-auto py-2 px-4">
        <nav className="flex items-center justify-between h-[73px]">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" height={40} width={40} alt="logo" />
            <p className="text-2xl font-semibold">Task Flow</p>
          </Link>
          <UserButton />
        </nav>
        <div className="flex flex-col items-center justify-center py-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default StandloneLayout;
