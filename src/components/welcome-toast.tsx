"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function WelcomeToast() {
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
      });
    }
  }, []);

  return null;
}
