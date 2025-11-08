"use client";

import { type ReactNode, useState } from "react";
import { Button } from "../ui/button";
import { BotMessageSquareIcon } from "lucide-react";
import { ChatSheet } from "../chatbot/chat-sheet";

export function AssistantButton(): ReactNode {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <div className="fixed bottom-14 right-4 z-[60] bg-background hover:bg-background/80 rounded-lg">
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <BotMessageSquareIcon className="size-4" />
        </Button>
      </div>

      <ChatSheet open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
