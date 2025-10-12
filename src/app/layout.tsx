import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ModeSwitcher } from "@/components/global/theme-switcher";
import { LogoutButton } from "@/components/global/logout-button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/navbar";
import { WelcomeToast } from "@/components/welcome-toast";
import { Toaster } from "sonner";
import { AuthButton } from "@/components/global/auth-button";
import { env } from "@/env";
import { BASE_URL } from "@/lib/utils";
import Footer from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen`}
      >
        <TooltipProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <main>
              {children}
              <Toaster closeButton position="top-center" />
              <WelcomeToast />
              <AuthButton />
              <ModeSwitcher />
            </main>
            <Footer />
          </ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
