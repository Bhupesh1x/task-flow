"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();

  const isSignIn = pathname === "/sign-in";

  return (
    <nav className="flex items-center justify-between">
      <Image src="/logo.svg" height={40} width={40} alt="logo" />

      <Button asChild variant="secondary">
        <Link href={isSignIn ? "/sign-up" : "/sign-in"}>
          {isSignIn ? "Sign Up" : "Sign In"}
        </Link>
      </Button>
    </nav>
  );
}
