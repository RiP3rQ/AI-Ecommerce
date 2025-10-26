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
        <Button variant="outline" size="icon" onClick={goToLogin}>
          <LogIn className="size-4 text-blue-400" />
          <span className="sr-only">Login</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Login to access advanced features</p>
      </TooltipContent>
    </Tooltip>
  );
}
