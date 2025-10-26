import { Navbar } from "@/components/layout/navbar";
import { CartProvider } from "@/providers/cart-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <Navbar />
      <main>{children}</main>
    </CartProvider>
  );
}
