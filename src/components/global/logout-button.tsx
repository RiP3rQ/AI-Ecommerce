"use client";

import { createClientSupabaseClient } from "@/supabase-auth/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { DoorOpen } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabaseClient = createClientSupabaseClient();
    await supabaseClient.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <Tooltip>
      <TooltipTrigger
        className="absolute bottom-16 right-4 z-[9999] bg-background hover:bg-background/80"
        asChild
      >
        <Button variant="outline" size="icon" onClick={logout}>
          <DoorOpen className="size-4 text-red-400" />
          <span className="sr-only">Logout</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Logout</p>
      </TooltipContent>
    </Tooltip>
  );
}
