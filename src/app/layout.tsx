import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ModeSwitcher } from "@/components/global/theme-switcher";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WelcomeToast } from "@/components/welcome-toast";
import { Toaster } from "sonner";
import { AuthButton } from "@/components/global/auth-button";
import { env } from "@/env";
import { BASE_URL } from "@/lib/utils";
import Footer from "@/components/layout/footer";
import { NuqsAdapter } from "nuqs/adapters/next/app";

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
  title: NEXT_PUBLIC_SITE_NAME,
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
      <head>
        {process.env.NODE_ENV === "development" && (
          <script
            crossOrigin="anonymous"
            src="//unpkg.com/react-scan/dist/auto.global.js"
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen`}
      >
        <NuqsAdapter>
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
        </NuqsAdapter>
      </body>
    </html>
  );
}
