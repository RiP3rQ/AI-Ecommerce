import { UpdatePasswordForm } from "@/app/auth/update-password/components/update-password-form";
import { ReactNode } from "react";

export default function Page(): ReactNode {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
