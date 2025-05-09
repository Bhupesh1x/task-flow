"use client";

import { z } from "zod";
import Image from "next/image";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ImageIcon } from "lucide-react";

import { useConfirm } from "@/hooks/useConfirm";

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

import { useUpdateProject } from "../api/useUpdateProject";
import { useDeleteProject } from "../api/useDeleteProject";

import { ProjectType } from "../types";
import { updateProjectSchema } from "../schemas";

type Props = {
  onCancel?: () => void;
  initialValues: ProjectType;
};

export const UpdateProjectForm = ({ onCancel, initialValues }: Props) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.image ?? "",
    },
  });

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete project",
    "This action cannot be undone",
    "destructive"
  );
  const { mutate, isPending } = useUpdateProject();
  const { mutate: deleteProject, isPending: isDeletePending } =
    useDeleteProject();

  const inputRef = useRef<HTMLInputElement>(null);

  function onSubmit(values: z.infer<typeof updateProjectSchema>) {
    const finalValues = {
      ...values,
      image: values.image || "",
    };

    mutate({ form: finalValues, param: { projectId: initialValues.$id } });
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

  async function onDelete() {
    const ok = await confirmDelete();

    if (!ok) return null;

    deleteProject(
      {
        param: {
          projectId: initialValues.$id,
        },
      },
      {
        onSuccess: () => {
          window.location.href = `/workspaces/${initialValues?.workspaceId}`;
        },
      }
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <Card className="h-full w-full border-none shadow-none">
        <CardHeader className="flex flex-row p-7 items-center gap-2 space-y-0">
          <Button
            size="sm"
            variant="secondary"
            onClick={
              onCancel
                ? onCancel
                : () =>
                    router.push(
                      `/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`
                    )
            }
          >
            <ArrowLeft className="size-5" />
            Back
          </Button>
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
                      <FormLabel>Project name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter project name" />
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
                        <p className="text-sm">Project Icon</p>
                        <p className="text-sm text-muted-foreground">
                          JPG, PNG, SVG or JPEG, max 1mb
                        </p>
                        {field.value ? (
                          <Button
                            type="button"
                            variant="destructive"
                            className="mt-2 w-fit"
                            size="sm"
                            disabled={isPending}
                            onClick={() => {
                              field.onChange("");
                              if (inputRef.current) {
                                inputRef.current.value = "";
                              }
                            }}
                          >
                            Remove Image
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="teritary"
                            className="mt-2 w-fit"
                            size="sm"
                            disabled={isPending}
                            onClick={handleImageUploadClick}
                          >
                            Upload Image
                          </Button>
                        )}
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
                  disabled={isPending || isDeletePending}
                  className={onCancel ? "visible" : "invisible"}
                >
                  Cancel
                </Button>
                <Button
                  onClick={onCancel}
                  disabled={isPending || isDeletePending}
                  size="lg"
                >
                  Update project
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="h-full w-full border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Danger Zone</CardTitle>
          <p className="text-sm text-muted-foreground">
            Deleting a project is an irreversible action and will remove all
            associated data
          </p>
        </CardHeader>
        <DottedSeprator className="py-2" />
        <CardContent>
          <Button
            disabled={isPending || isDeletePending}
            onClick={onDelete}
            variant="destructive"
            className="flex ml-auto mt-2"
          >
            Delete project
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
