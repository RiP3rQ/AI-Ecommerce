"use client";

import { LogoutButton } from "@/components/global/logout-button";
import { LoginButton } from "@/components/global/login-button";

import { useAuth } from "@/hooks/use-auth";
import type { ReactNode } from "react";

export function AuthButton(): ReactNode {
  const { isAuthenticated } = useAuth();

  return (
    <div className="fixed bottom-16 right-4 z-[55] bg-background hover:bg-background/80 rounded-lg">
      {isAuthenticated ? <LogoutButton /> : <LoginButton />}
    </div>
  );
}
