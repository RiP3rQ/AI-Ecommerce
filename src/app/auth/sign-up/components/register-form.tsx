"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/supabase-auth/client";
import { Link } from "react-transition-progress/next";

interface RegisterFormProps extends ComponentProps<"div"> {}

export function RegisterForm({
  className,
  ...props
}: RegisterFormProps): ReactNode {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabaseClient = createClientSupabaseClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await supabaseClient.auth
        .signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        })
        .then(async (response) => {
          // Call a /api/register endpoint to create the user in the database
          if (response.error) {
            throw response.error;
          }
          if (!response.data?.user?.email || !response.data?.user?.id) {
            throw new Error("User email or ID not found");
          }
          await fetch("/api/register", {
            method: "POST",
            body: JSON.stringify({
              email: response.data?.user?.email,
              userId: response.data?.user?.id,
            }),
          });
        });
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      console.error(error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSignUp} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create an account</h1>
                <p className="text-muted-foreground text-balance">
                  Enter your details below to create your Acme Inc account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </Field>
              <div className="flex items-center justify-center gap-2">
                <Checkbox
                  id="agreed-to-terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) =>
                    setAgreedToTerms(Boolean(checked))
                  }
                  className="size-4"
                />
                <FieldLabel htmlFor="agreed-to-terms">
                  I agree to the{" "}
                  <Link
                    href="/terms-of-service"
                    className="underline underline-offset-4"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    className="underline underline-offset-4"
                  >
                    Privacy Policy
                  </Link>
                </FieldLabel>
              </div>
              <Field>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isLoading || !agreedToTerms}
                >
                  {isLoading ? "Creating an account..." : "Sign up"}
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field className="grid grid-cols-1 gap-4">
                <Button
                  variant="outline"
                  type="button"
                  disabled={isLoading || !agreedToTerms}
                  className="cursor-pointer"
                >
                  <GoogleIcon />
                  <span>Continue with Google</span>
                  <span className="sr-only">Sign up with Google</span>
                </Button>
              </Field>
              <FieldDescription className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4"
                  prefetch={true}
                >
                  Login
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
              height={520}
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
