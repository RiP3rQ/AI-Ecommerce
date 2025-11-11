import { RotateCcwIcon, Sparkles } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "../ui/button";
import { MessageType } from "@/types/chat";
import { ChatStatus } from "ai";

export function MessagesCounterAndResetChatButton({
  messages,
  isAuthenticated,
  status,
  handleResetChat,
  handleShowCapabilities,
}: Readonly<{
  messages: MessageType[];
  isAuthenticated: boolean;
  status: ChatStatus;
  handleResetChat: () => void;
  handleShowCapabilities: () => void;
}>): ReactNode {
  return (
    <div className="flex items-center justify-between px-4 pb-1">
      <span className="text-md text-muted-foreground">
        {messages.length === 1 ? "1 message" : `${messages.length} messages`}
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleShowCapabilities}
          disabled={!isAuthenticated}
          className="h-8 gap-2 cursor-pointer"
          title="View AI capabilities"
        >
          <Sparkles className="size-3.5" />
          <span className="hidden sm:inline">Capabilities</span>
        </Button>
        {messages.length > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetChat}
            disabled={
              !isAuthenticated ||
              status === "streaming" ||
              status === "submitted"
            }
            className="h-8 gap-2 cursor-pointer"
          >
            <RotateCcwIcon className="size-3.5" />
            <span className="hidden sm:inline">Reset Chat</span>
          </Button>
        )}
      </div>
    </div>
  );
}
