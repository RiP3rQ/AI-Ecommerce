import { useEffect, type ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import Chat from "./chat";
import { Separator } from "../ui/separator";
import { useCart } from "@/providers/cart-provider";

export function ChatSheet({
  open,
  onOpenChange,
}: Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>): ReactNode {
  const { setDirectionOfTheSheet } = useCart();

  useEffect(() => {
    if (open) {
      setDirectionOfTheSheet("left");
    } else {
      setDirectionOfTheSheet("right");
    }
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="z-[100] sm:max-w-xl w-xl">
        <SheetHeader className="p-0 px-4 pt-4">
          <SheetTitle>Your own AI assistant</SheetTitle>
          <SheetDescription>
            Ask me anything about the products you are looking for.
          </SheetDescription>
          <Separator />
        </SheetHeader>
        <Chat />
      </SheetContent>
    </Sheet>
  );
}
