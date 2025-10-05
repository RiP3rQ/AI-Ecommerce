import { env } from "@/env";
import { createBrowserClient } from "@supabase/ssr";

export function createClientSupabaseClient() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}
