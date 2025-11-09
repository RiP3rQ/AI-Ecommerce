import { RotateCcwIcon } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "../ui/button";
import { MessageType } from "@/types/chat";
import { ChatStatus } from "ai";

export function MessagesCounterAndResetChatButton({
  messages,
  isAuthenticated,
  status,
  handleResetChat,
}: Readonly<{
  messages: MessageType[];
  isAuthenticated: boolean;
  status: ChatStatus;
  handleResetChat: () => void;
}>): ReactNode {
  return (
    <div className="flex items-center justify-between px-4 pb-1">
      <span className="text-md text-muted-foreground">
        {messages.length === 1 ? "1 message" : `${messages.length} messages`}
      </span>
      {messages.length > 1 && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetChat}
          disabled={
            !isAuthenticated || status === "streaming" || status === "submitted"
          }
          className="h-8 gap-2 cursor-pointer"
        >
          <RotateCcwIcon className="size-3.5" />
          Reset Chat
        </Button>
      )}
    </div>
  );
}
