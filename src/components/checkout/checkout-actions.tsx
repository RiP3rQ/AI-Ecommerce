"use client";

import { ReactNode, useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { completeCheckout } from "@/lib/checkout-api";
import LoadingDots from "../loading-dots";

export function CheckoutActions(): ReactNode {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCompletePurchase = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await completeCheckout();
      router.push("/checkout/complete");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button
        className="flex-1"
        size="lg"
        onClick={handleCompletePurchase}
        disabled={isLoading}
      >
        {isLoading ? (
          <LoadingDots className="text-white" />
        ) : (
          "Complete Purchase"
        )}
      </Button>
      <Button
        variant="outline"
        className="flex-1"
        size="lg"
        onClick={handleGoBack}
        disabled={isLoading}
      >
        Continue Shopping
      </Button>
    </div>
  );
}
