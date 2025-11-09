import { Navbar } from "@/components/layout/navbar";
import { createServerSupabaseClient } from "@/supabase-auth/server";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();


  if (!user) {
    redirect("/auth/login");
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
