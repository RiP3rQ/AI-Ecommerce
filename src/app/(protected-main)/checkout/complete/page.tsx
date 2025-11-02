import { CheckoutComplete } from "@/components/checkout-complete/checkout-complete";
import { Suspense, type ReactNode } from "react";

export default function CheckoutCompletePage(): ReactNode {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutComplete />
    </Suspense>
  );
}
