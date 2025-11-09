import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { ModeSwitcher } from "@/components/global/theme-switcher";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WelcomeToast } from "@/components/welcome-toast";
import { Toaster } from "sonner";
import { env } from "@/env";
import { BASE_URL } from "@/lib/utils";
import Footer from "@/components/layout/footer";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { AssistantButton } from "@/components/global/assistant-button";
import { Onborda, OnbordaProvider } from "onborda";

import "./globals.css";
import { CartProvider } from "@/providers/cart-provider";
import { TourCard } from "@/components/tour/tour-card";
import { Tour } from "onborda/dist/types";

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

const steps: Tour[] = [
  {
    tour: "Onboard Tour",
    steps: [
      {
        icon: <>👋</>,
        title: "Tour 1, Step 1",
        content: <>First tour, first step</>,
        selector: "#tour1-step1",
        side: "top",
        showControls: true,
        pointerPadding: 10,
        pointerRadius: 10,
        nextRoute: "/",
        prevRoute: "/",
      },
    ],
  },
];

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
        <OnbordaProvider>
          <Onborda
            steps={steps}
            showOnborda={true}
            shadowRgb="55,48,163"
            shadowOpacity="0.8"
            cardComponent={TourCard}
            cardTransition={{ duration: 2, type: "tween" }}
          >
            <NuqsAdapter>
              <TooltipProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="dark"
                  enableSystem
                  disableTransitionOnChange
                >
                  <CartProvider>
                    <main>
                      {children}
                      <Toaster closeButton position="top-center" />
                      <WelcomeToast />
                      <AssistantButton />
                      <ModeSwitcher />
                    </main>
                    <Footer />
                  </CartProvider>
                </ThemeProvider>
              </TooltipProvider>
            </NuqsAdapter>
          </Onborda>
        </OnbordaProvider>
      </body>
    </html>
  );
}
