"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "./actions";
import { useActionState } from "react";
import { ActionState } from "@/lib/auth/middleware";
import Link from "next/link";

type LoginFormProps = React.ComponentPropsWithoutRef<"div"> & {
  mode?: "signin" | "signup";
};

export function LoginForm({ className, ...props }: LoginFormProps) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    props.mode === "signin" ? signIn : signUp,
    { error: "" }
  );
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {props.mode === "signin" ? "Login" : "Signup"}
          </CardTitle>
          <CardDescription>
            Enter your email below to{" "}
            {props.mode === "signin" ? "login to" : "create"} your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  defaultValue={state.email}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  defaultValue={state.password}
                  required
                />
              </div>
              {state?.error && (
                <div className="text-red-500 text-sm">{state.error}</div>
              )}
              <Button type="submit" className="w-full" disabled={pending}>
                {props.mode === "signin" ? "Login" : "Signup"}
              </Button>
              {/* <Button variant="outline" className="w-full">
                Login with Google
              </Button> */}
            </div>
            <div className="mt-4 text-center text-sm">
              {props.mode === "signin"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <Link
                href={props.mode === "signin" ? "/sign-up" : "/sign-in"}
                className="underline underline-offset-4"
              >
                {props.mode === "signin" ? "Signup" : "Login"}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
