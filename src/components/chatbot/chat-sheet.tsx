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
import { useCartState } from "@/hooks/use-cart";

export function ChatSheet({
  open,
  onOpenChange,
}: Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>): ReactNode {
  const { setDirection } = useCartState();

  useEffect(() => {
    if (open) {
      setDirection("left");
    } else {
      setDirection("right");
    }
  }, [open, setDirection]);

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
