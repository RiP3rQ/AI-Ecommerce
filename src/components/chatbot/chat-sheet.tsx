import type { ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import Chat from "./chat";
import { Separator } from "../ui/separator";

export function ChatSheet({
  open,
  onOpenChange,
}: Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>): ReactNode {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="z-[100] sm:max-w-xl w-xl">
        <SheetHeader>
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
