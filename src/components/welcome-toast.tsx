"use client";

import { ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { useOnborda } from "onborda";
import { ONBOARDING_TOUR_NAME } from "./tour/onboarding-steps";
import { usePathname, useRouter } from "next/navigation";

export function WelcomeToast(): ReactNode {
  const pathname = usePathname();
  const router = useRouter();
  const { startOnborda } = useOnborda();

  useEffect(() => {
    // ignore if screen height is too small
    if (window.innerHeight < 650) return;
    if (!document.cookie.includes("welcome-toast=2")) {
      toast("🚀 Welcome to AI-Powered Commerce!", {
        id: "welcome-toast",
        duration: Infinity,
        position: "bottom-left",
        onDismiss: () => {
          document.cookie = "welcome-toast=2; max-age=31536000; path=/";
        },
        description: (
          <>
            Experience the future of shopping with our cutting-edge platform.
            Featuring intelligent product discovery, seamless authentication,
            and stunning visual experiences powered by Next.js and modern
            AI-driven design.
          </>
        ),
        action: {
          label: "Start Tour",
          onClick: () => {
            if (pathname !== "/") {
              router.push("/");
            }
            startOnborda(ONBOARDING_TOUR_NAME);
            toast.dismiss("welcome-toast");
          },
        },
      });
    }
  }, [startOnborda, pathname, router]);

  return null;
}
