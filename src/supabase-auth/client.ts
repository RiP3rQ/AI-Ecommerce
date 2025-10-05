import { createBrowserClient } from "@supabase/ssr";

export function createClientSupabaseClient() {
  console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
