import { RegisterForm } from "@/app/auth/sign-up/components/register-form";
import type { ReactNode } from "react";

export default function SignUpPage(): ReactNode {
  return (
    <div className="bg-muted flex min-h-[calc(100vh-72px)] flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <RegisterForm />
      </div>
    </div>
  );
}
