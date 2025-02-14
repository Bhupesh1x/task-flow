"use client";

import { z } from "zod";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { workspaceSchema } from "../schema";
import { useCreateWorkspace } from "../api/useCreateWorkspace";

type Props = {
  onCancel?: () => void;
};

export const CreateWorkspaceForm = ({ onCancel }: Props) => {
  const form = useForm<z.infer<typeof workspaceSchema>>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  const { mutate, isPending } = useCreateWorkspace();

  function onSubmit(values: z.infer<typeof workspaceSchema>) {
    mutate(values);
  }

  return (
    <Card className="h-full w-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create a new workspace
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
            </div>
            <DottedSeprator className="py-7" />

            <div className="flex items-center justify-between">
              <Button
                type="button"
                onClick={onCancel}
                size="lg"
                variant="secondary"
                disabled={isPending}
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
