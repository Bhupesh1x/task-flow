"use client";

import z from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";

import { signUpWithGithub, signUpWithGoogle } from "@/lib/oauth";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DottedSeprator } from "@/components/DottedSeprator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { loginSchema } from "../schemas";
import { useLogin } from "../api/useLogin";

export function SignInCard() {
  const { mutate, isPending } = useLogin();
  const form = useForm<z.infer<typeof loginSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    mutate(values);
  }

  return (
    <Card className="h-full w-full md:w-[500px] mx-auto border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Welcome back!</CardTitle>
      </CardHeader>

      <div className="mb-2 px-7">
        <DottedSeprator />
      </div>

      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter email address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isPending} className="w-full" size="lg">
              Login
            </Button>
          </form>
        </Form>
      </CardContent>

      <div className="px-7">
        <DottedSeprator />
      </div>

      <CardContent className="p-7 space-y-4">
        <Button
          disabled={isPending}
          size="lg"
          variant="secondary"
          className="w-full"
          onClick={() => signUpWithGoogle()}
        >
          <FcGoogle className="mr-2 size-5" />
          Login with google
        </Button>
        <Button
          disabled={isPending}
          size="lg"
          variant="secondary"
          className="w-full"
          onClick={() => signUpWithGithub()}
        >
          <FaGithub className="mr-2 size-5" />
          Login with github
        </Button>
      </CardContent>

      <div className="px-7">
        <DottedSeprator />
      </div>

      <CardContent className="p-7 flex items-center justify-center">
        <p>
          Don&apos;t have an account{" "}
          <Link href="/sign-up">
            <span className="text-lue-600">Sign Up</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
