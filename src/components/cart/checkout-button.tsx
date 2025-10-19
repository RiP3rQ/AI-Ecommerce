import { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import LoadingDots from "../loading-dots";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export function CheckoutButton(): ReactNode {
  const { pending } = useFormStatus();
  const router = useRouter();

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <Button
      className="w-full rounded-full bg-blue-600 p-3 text-center text-sm font-medium text-white opacity-90 hover:opacity-100 cursor-pointer"
      type="button"
      disabled={pending}
      onClick={handleCheckout}
    >
      {pending ? <LoadingDots className="bg-white" /> : "Proceed to Checkout"}
    </Button>
  );
}
