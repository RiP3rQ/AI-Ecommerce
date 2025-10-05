import { redirect } from "next/navigation";
import { createClientSupabaseClient } from "@/supabase-auth/client";
import { ReactNode } from "react";

export default async function PrivatePage(): Promise<ReactNode> {
  const supabase = await createClientSupabaseClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }
  return <p>Hello {data.user.email}</p>;
}
