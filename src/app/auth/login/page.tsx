import { LoginForm } from "@/app/auth/login/components/login-form";
import { ReactNode } from "react";

export default function LoginPage(): ReactNode {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  );
}
