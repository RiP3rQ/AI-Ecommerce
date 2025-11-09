"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function LoginButton() {
  const router = useRouter();

  const goToLogin = () => {
    router.push("/auth/login");
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          className="h-11 px-3"
          onClick={goToLogin}
          id="onboarding-tour-step-1"
        >
          <LogIn className="size-4 text-blue-400 mr-2" />
          Login
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Login to access advanced features</p>
      </TooltipContent>
    </Tooltip>
  );
}
