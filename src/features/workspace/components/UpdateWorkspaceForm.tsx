"use client";

import { z } from "zod";
import Image from "next/image";
import { useRef } from "react";
import { ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DottedSeprator } from "@/components/DottedSeprator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { WorkspaceType } from "../types";
import { updateWorkspaceSchema } from "../schema";
import { useUpdateWorkspace } from "../api/useUpdateWorkspace";

type Props = {
  onCancel?: () => void;
  initialValues: WorkspaceType;
};

export const UpdateWorkspaceForm = ({ onCancel, initialValues }: Props) => {
  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.image ?? "",
    },
  });

  const { mutate, isPending } = useUpdateWorkspace();

  const inputRef = useRef<HTMLInputElement>(null);

  function onSubmit(values: z.infer<typeof updateWorkspaceSchema>) {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };

    mutate({ form: finalValues, param: { workspaceId: initialValues.$id } });
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (file) {
      form.setValue("image", file);
    }
  }

  function handleImageUploadClick() {
    inputRef?.current?.click();
  }

  return (
    <Card className="h-full w-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          {initialValues?.name}
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeprator />
      </div>

      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter workspace name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="image"
                control={form.control}
                render={({ field }) => (
                  <div className="flex items-center gap-x-6">
                    {field.value ? (
                      <div className="size-[72px] relative rounded-md overflow-hidden">
                        <Image
                          fill
                          src={
                            field.value instanceof File
                              ? URL.createObjectURL(field.value)
                              : field.value
                          }
                          alt="logo"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <Avatar className="h-[72px] w-[72px]">
                          <AvatarFallback>
                            <ImageIcon className="size-[36px] text-neutral-500" />
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    <div>
                      <p className="text-sm">Workspace Icon</p>
                      <p className="text-sm text-muted-foreground">
                        JPG, PNG, SVG or JPEG, max 1mb
                      </p>
                      <Button
                        type="button"
                        variant="teritary"
                        className="mt-2 w-fit"
                        size="sm"
                        disabled={isPending}
                        onClick={handleImageUploadClick}
                      >
                        Upload
                      </Button>
                      <input
                        type="file"
                        accept=".jpg, .png, .svg, .jpeg"
                        className="hidden"
                        ref={inputRef}
                        onChange={handleImageChange}
                        disabled={isPending}
                      />
                    </div>
                  </div>
                )}
              />
            </div>
            <DottedSeprator className="py-7" />

            <div className="flex items-center justify-between">
              <Button
                type="button"
                onClick={onCancel}
                size="lg"
                variant="secondary"
                disabled={isPending}
                className={onCancel ? "visible" : "invisible"}
              >
                Cancel
              </Button>
              <Button onClick={onCancel} disabled={isPending} size="lg">
                Create
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
