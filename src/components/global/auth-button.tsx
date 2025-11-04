"use client";

import { LogoutButton } from "@/components/global/logout-button";
import { LoginButton } from "@/components/global/login-button";

import { useAuth } from "@/hooks/use-auth";
import type { ReactNode } from "react";

function UserGreeting() {
  const { user } = useAuth();

  if (!user?.email) return null;

  return (
    <span className="text-sm text-neutral-600 dark:text-neutral-400">
      Hello {user.email}
    </span>
  );
}

export function AuthButton(): ReactNode {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginButton />;
  }

  return (
    <div className="flex items-center gap-2">
      <UserGreeting />
      <LogoutButton />
    </div>
  );
}
