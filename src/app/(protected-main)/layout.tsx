import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { env } from "@/env";
import { BASE_URL } from "@/lib/utils";
import { CartProvider } from "@/providers/cart-provider";
import { getCart } from "@/components/products/actions";

const { NEXT_PUBLIC_SITE_NAME } = env;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: NEXT_PUBLIC_SITE_NAME,
    template: `%s | ${NEXT_PUBLIC_SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart();

  return (
    <CartProvider cartPromise={cart}>
      <Navbar />
      <main>{children}</main>
    </CartProvider>
  );
}
