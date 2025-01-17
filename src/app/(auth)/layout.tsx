import Image from "next/image";

import { Button } from "@/components/ui/button";

type Props = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="max-w-screen-2xl mx-auto p-4">
        <nav className="flex items-center justify-between">
          <Image src="/logo.svg" height={40} width={40} alt="logo" />

          <Button variant="secondary">Sign Up</Button>
        </nav>

        <div>{children}</div>
      </div>
    </main>
  );
};

export default AuthLayout;
