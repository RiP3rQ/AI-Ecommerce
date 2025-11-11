import { Navbar } from "@/components/layout/navbar";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar hideAuthButtons={true} hideCartDrawer={true} />
      <main>{children}</main>
    </>
  );
}
