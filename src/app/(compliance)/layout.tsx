import Footer from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function ComplianceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar hideAuthButtons={true} hideCartDrawer={true} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
