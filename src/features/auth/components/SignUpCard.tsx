"use client";

import { z } from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DottedSeprator } from "@/components/DottedSeprator";

import { registerSchema } from "../schemas";
import { useRegister } from "../api/useRegister";

export function SignUpCard() {
  const { mutate, isPending } = useRegister();

  const form = useForm<z.infer<typeof registerSchema>>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(registerSchema),
  });

  function onSubmit(values: z.infer<typeof registerSchema>) {
    mutate(values);
  }

  return (
    <Card className="h-full w-full md:w-[500px] mx-auto border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          By signing up, you agree to our{" "}
          <span className="text-blue-600">Privacy Policy</span> and{" "}
          <span className="text-blue-600">Terms of service</span>
        </CardDescription>
      </CardHeader>

      <div className="mb-2 px-7">
        <DottedSeprator />
      </div>

      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter your name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              Sign up
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
        >
          <FcGoogle className="mr-2 size-5" />
          Sign up with google
        </Button>
        <Button
          disabled={isPending}
          size="lg"
          variant="secondary"
          className="w-full"
        >
          <FaGithub className="mr-2 size-5" />
          Sign up with github
        </Button>
      </CardContent>

      <div className="px-7">
        <DottedSeprator />
      </div>

      <CardContent className="p-7 flex items-center justify-center">
        <p>
          Already have an account{" "}
          <Link href="/sign-in">
            <span className="text-lue-600">Sign In</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
