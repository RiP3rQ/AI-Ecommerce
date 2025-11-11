import { UpdatePasswordForm } from "@/app/auth/update-password/components/update-password-form";
import type { ReactNode } from "react";

export default function Page(): ReactNode {
  return (
    <div className="flex min-h-[calc(100vh-72px)] w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
