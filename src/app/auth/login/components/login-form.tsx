"use client";

import { BASE_URL, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { type ComponentProps, type ReactNode, useState } from "react";
import { GoogleIcon } from "../../../../../public/icons";
import Image from "next/image";
import { createClientSupabaseClient } from "@/supabase-auth/client";
import { redirect, useRouter } from "next/navigation";
import { Link } from "react-transition-progress/next";

interface LoginFormProps extends ComponentProps<"div"> {}

export function LoginForm({ className, ...props }: LoginFormProps): ReactNode {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabaseClient = createClientSupabaseClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push("/");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabaseClient = createClientSupabaseClient();
    setIsLoading(true);
    setError(null);
    let url: string | null = null;

    try {
      const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${BASE_URL}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      if (data) {
        url = data.url;
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }

    if (url) {
      redirect(url); // use the redirect API for your server framework
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleLogin}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your {process.env.NEXT_PUBLIC_SITE_NAME} account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  disabled={isLoading}
                  autoFocus
                  value={email}
                  data-testid="email-input"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                    prefetch={true}
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  disabled={isLoading}
                  value={password}
                  data-testid="password-input"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                />
              </Field>
              <Field>
                {error && (
                  <p
                    className="text-sm text-red-500"
                    data-testid="error-message"
                  >
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isLoading}
                  data-testid="login-button"
                >
                  {isLoading ? "Logging in..." : "Login"}
                  <span className="sr-only">Login</span>
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field className="grid grid-cols-1 gap-4">
                <Button
                  variant="outline"
                  type="button"
                  className="cursor-pointer"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  data-testid="google-login-button"
                >
                  <GoogleIcon />
                  {isLoading
                    ? "Logging in with Google..."
                    : "Continue with Google"}
                  <span className="sr-only">Continue with Google</span>
                </Button>
              </Field>
              <FieldDescription className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/sign-up"
                  className="underline underline-offset-4"
                  prefetch={true}
                >
                  Sign up
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/images/ecommerce_login_page.png"
              alt="Ecommerce Login Page"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              width={500}
              height={500}
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
