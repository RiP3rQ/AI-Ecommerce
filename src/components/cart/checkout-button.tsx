import type { ReactNode } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useCartState } from "@/providers/cart-provider";

export function CheckoutButton(): ReactNode {
  const router = useRouter();
  const { closeCart } = useCartState();

  const handleCheckout = () => {
    router.push("/checkout");
    closeCart();
  };

  return (
    <Button
      className="w-full rounded-full bg-blue-600 p-3 text-center text-sm font-medium text-white opacity-90 hover:opacity-100 cursor-pointer"
      type="button"
      onClick={handleCheckout}
    >
      Proceed to Checkout
    </Button>
  );
}
