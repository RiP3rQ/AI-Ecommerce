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
import { AssistantButton } from "@/components/chatbot/assistant-button";
import { Onborda, OnbordaProvider } from "onborda";
import { MobileNoticeModal } from "@/components/global/mobile-notice-modal";
import "./globals.css";
import { CartProvider } from "@/providers/cart-provider";
import { ChatProvider } from "@/providers/chat-provider";
import { Provider } from "react-redux";
import { cartStore } from "@/store";
import { TourCard } from "@/components/tour/tour-card";
import { onboardingSteps } from "@/components/tour/onboarding-steps";
import { ProgressBar, ProgressBarProvider } from "react-transition-progress";

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
        {/* REACT SCAN */}
        {process.env.NODE_ENV === "development" && (
          <script
            crossOrigin="anonymous"
            src="//unpkg.com/react-scan/dist/auto.global.js"
          />
        )}
        {/* PRE-FETCH MOST IMPORTANT API ROUTES FOR SWR */}
        <link
          rel="preload"
          href="/api/main-page"
          as="fetch"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/api/main-page?limit=20&skipFirstNumberOfProducts=3"
          as="fetch"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/api/shop?page=1&limit=12&sortDirection=asc&sortField=createdAt&priceMin=0&priceMax=100000"
          as="fetch"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/api/categories"
          as="fetch"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen`}
      >
        <OnbordaProvider>
          <Onborda
            steps={onboardingSteps}
            showOnborda={true}
            shadowRgb="55,48,163"
            shadowOpacity="0.8"
            cardComponent={TourCard}
            cardTransition={{ duration: 0.5, type: "spring" }}
          >
            <NuqsAdapter>
              <TooltipProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="dark"
                  enableSystem
                  disableTransitionOnChange
                >
                  <Provider store={cartStore}>
                    <CartProvider>
                      <ChatProvider>
                        <ProgressBarProvider>
                          <ProgressBar className="fixed w-full h-1 shadow-lg shadow-sky-500/20 bg-sky-500 top-0" />
                          <main>
                            {children}
                            <Toaster closeButton position="top-center" />
                            <WelcomeToast />
                            <MobileNoticeModal />
                            <AssistantButton />
                            <ModeSwitcher />
                          </main>
                        </ProgressBarProvider>
                      </ChatProvider>
                    </CartProvider>
                  </Provider>
                </ThemeProvider>
              </TooltipProvider>
            </NuqsAdapter>
          </Onborda>
        </OnbordaProvider>
      </body>
    </html>
  );
}
