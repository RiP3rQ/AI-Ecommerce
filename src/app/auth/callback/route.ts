import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createServerSupabaseClient } from "@/supabase-auth/server";
import { registerUserSchema } from "@/app/api/register/dto";
import { registerService } from "@/app/api/register/service";
import { drizzleDbClient } from "@/database";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) {
    // if "next" is not a relative URL, use the default
    next = "/";
  }
  if (code) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Step 1: Parse the data and create a DTO
      const dto = {
        email: data?.user?.email,
        userId: data?.user?.id,
      };
      const validatedDto = registerUserSchema.parse(dto);

      // Step 2: Create profile in database
      const profile = await registerService.createProfile({
        dto: validatedDto,
        db: drizzleDbClient(),
      });
      if (!profile) {
        return NextResponse.redirect(
          `${origin}/auth/error?error=Failed to create profile`,
        );
      }

      // Step 3: Redirect to the next page
      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }
  // If the code is not found, redirect to the error page
  return NextResponse.redirect(
    `${origin}/auth/error?error=Callback error for OAuth`,
  );
}
