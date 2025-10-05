"use client";

import { createClientSupabaseClient } from "@/supabase-auth/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabaseClient = createClientSupabaseClient();
    await supabaseClient.auth.signOut();
    router.push("/auth/login");
  };

  return <Button onClick={logout}>Logout</Button>;
}
