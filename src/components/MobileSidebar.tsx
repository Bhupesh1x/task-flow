"use client";

import { MenuIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

import { Sidebar } from "./Sidebar";

export const MobileSidebar = () => {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" className="lg:hidden">
          <MenuIcon className="!size-5 text-neutral-500" />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-0" side="left">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
