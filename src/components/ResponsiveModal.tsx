import { useMedia } from "react-use";

import { Dialog, DialogContent } from "./ui/dialog";
import { Drawer, DrawerContent } from "./ui/drawer";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

export function ResponsiveModal({ open, onOpenChange, children }: Props) {
  const isDesktop = useMedia("(min-width: 1024px)", true);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full sm:max-w-screen-sm overflow-y-auto max-h-[85vh] p-0 border-none hide-scrollbar">
          {children}
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <div className="overflow-y-auto max-h-[85vh] hide-scrollbar">
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
}
