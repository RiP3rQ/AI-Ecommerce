import { Tour } from "onborda/dist/types";

export const ONBOARDING_TOUR_NAME = "Onboard Tour";

export const onboardingSteps: Tour[] = [
  {
    tour: ONBOARDING_TOUR_NAME,
    steps: [
      {
        icon: <>🔑</>,
        title: "Sign in",
        content: (
          <>
            Here you can login to get access to all advanced AI-Powered
            features.
          </>
        ),
        selector: "#onboarding-tour-step-1",
        side: "bottom-right",
        showControls: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
      {
        icon: <>💬</>,
        title: "Chat with AI",
        content: (
          <>
            Here you can chat with the AI to get product recommendations, help
            with reviews, add products to your cart or get the most liked
            products.
          </>
        ),
        selector: "#onboarding-tour-step-2",
        side: "top-right",
        showControls: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
      {
        icon: <>👕</>,
        title: "Product card",
        content: (
          <>
            Here you can see basic information about a product like title or
            price. You can click on the product to see more details.
          </>
        ),
        selector: "#onboarding-tour-step-3",
        side: "bottom",
        showControls: true,
        pointerPadding: 10,
        pointerRadius: 10,
        nextRoute: "/product/44444444-4444-4444-4444-444444444444",
      },
      {
        icon: <>📇</>,
        title: "Product details",
        content: (
          <>
            Here you can see detailed information about a product like title,
            price, description, images, reviews, etc.
          </>
        ),
        selector: "#onboarding-tour-step-4",
        side: "bottom",
        showControls: true,
        pointerPadding: 10,
        pointerRadius: 10,
        prevRoute: "/",
      },
      {
        icon: <>😍</>,
        title: "Variant selection",
        content: (
          <>
            Here you can select the variant of the product you want to add to
            your cart.
          </>
        ),
        selector: "#onboarding-tour-step-5",
        side: "bottom",
        showControls: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
      {
        icon: <>⭐</>,
        title: "Product reviews",
        content: <>Here you can see the reviews of the product.</>,
        selector: "#onboarding-tour-step-6",
        side: "top",
        showControls: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
      {
        icon: <>✍️</>,
        title: "Add your own review",
        content: <>Here you can add your own review to the product.</>,
        selector: "#onboarding-tour-step-7",
        side: "bottom",
        showControls: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
      {
        icon: <>❔</>,
        title: "Ask a question about the reviews",
        content: (
          <>Here you can ask a question about the reviews of the product.</>
        ),
        selector: "#onboarding-tour-step-8",
        side: "bottom",
        showControls: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
      {
        icon: <>📓</>,
        title: "Summarize reviews",
        content: <>Here you can summarize the reviews of the product.</>,
        selector: "#onboarding-tour-step-9",
        side: "bottom",
        showControls: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
    ],
  },
];
