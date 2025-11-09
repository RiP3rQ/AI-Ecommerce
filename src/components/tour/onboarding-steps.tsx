import { Tour } from "onborda/dist/types";

export const ONBOARDING_TOUR_NAME = "Onboard Tour";

export const onboardingSteps: Tour[] = [
  {
    tour: ONBOARDING_TOUR_NAME,
    steps: [
      {
        icon: <>👋</>,
        title: "Onboarding Tour, Step 1",
        content: (
          <>Here you can login to get access to all advanced AI-Powered features.</>
        ),
        selector: "#onboarding-tour-step-1",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 10,
        pointerRadius: 10,
        nextRoute: "/",
        prevRoute: "/",
      },
    ],
  },
];
