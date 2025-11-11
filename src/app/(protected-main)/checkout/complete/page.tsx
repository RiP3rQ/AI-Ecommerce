import { CheckoutComplete } from "@/components/checkout-complete/checkout-complete";
import { Suspense, type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutCompletePage(): ReactNode {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Skeleton className="w-16 h-16 rounded-full mx-auto" />
            </div>
            <Skeleton className="h-8 w-80 mx-auto mb-2" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
        </div>
      }
    >
      <CheckoutComplete />
    </Suspense>
  );
}
