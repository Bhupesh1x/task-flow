"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { Input } from "@/components/ui/input";
import DottedSeprator from "@/components/DottedSeprator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SignUpCard() {
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
        <div className="space-y-4">
          <Input
            required
            type="text"
            value={""}
            onChange={() => {}}
            placeholder="Enter your name"
            disabled={false}
          />
          <Input
            required
            type="email"
            value={""}
            onChange={() => {}}
            placeholder="Enter email address"
            disabled={false}
          />
          <Input
            required
            type="password"
            value={""}
            onChange={() => {}}
            placeholder="Enter password"
            disabled={false}
            min={8}
            max={256}
          />
          <Button disabled={false} className="w-full" size="lg">
            Login
          </Button>
        </div>
      </CardContent>

      <div className="px-7">
        <DottedSeprator />
      </div>

      <CardContent className="p-7 space-y-4">
        <Button
          disabled={false}
          size="lg"
          variant="secondary"
          className="w-full"
        >
          <FcGoogle className="mr-2 size-5" />
          Login with google
        </Button>
        <Button
          disabled={false}
          size="lg"
          variant="secondary"
          className="w-full"
        >
          <FaGithub className="mr-2 size-5" />
          Login with github
        </Button>
      </CardContent>
    </Card>
  );
}
