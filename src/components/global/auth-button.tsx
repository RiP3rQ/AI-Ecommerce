import { LogoutButton } from "./logout-button";

import { createServerSupabaseClient } from "@/supabase-auth/server";

export async function AuthButton() {
  const supabaseClient = await createServerSupabaseClient();

  // Proritize getClaims() over getUser() because getClaims() is faster
  const { data } = await supabaseClient.auth.getClaims();

  const user = data?.claims;

  return user ? (
    <div className="fixed bottom-16 right-4 z-[55] bg-background hover:bg-background/80">
      <LogoutButton />
    </div>
  ) : null;
}
