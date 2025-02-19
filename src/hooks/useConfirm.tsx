"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, ButtonProps } from "@/components/ui/button";
import { ResponsiveModal } from "@/components/ResponsiveModal";

export function useConfirm(
  title: string,
  message: string,
  variant: ButtonProps["variant"] = "default"
): [() => JSX.Element, () => Promise<unknown>] {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  function confirm() {
    return new Promise((resolve) => {
      setPromise({ resolve });
    });
  }

  function handleClose() {
    setPromise(null);
  }

  function onConfirm() {
    promise?.resolve(true);
    handleClose();
  }

  function onCancel() {
    promise?.resolve(false);
    handleClose();
  }

  const ConfirmDialog = () => (
    <ResponsiveModal open={promise !== null} onOpenChange={handleClose}>
      <Card className="h-full w-full border-none shadow-none">
        <CardContent className="py-4">
          <CardHeader className="p-0">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>

          <div className="pt-4 flex flex-col gap-2 md:flex-row items-center md:justify-end">
            <Button
              onClick={onCancel}
              variant="outline"
              className="w-full md:!w-fit"
            >
              Cancel
            </Button>

            <Button
              onClick={onConfirm}
              variant={variant}
              className="w-full md:!w-fit"
            >
              Confirm
            </Button>
          </div>
        </CardContent>
      </Card>
    </ResponsiveModal>
  );

  return [ConfirmDialog, confirm];
}
