"use client";

import type { MessageType } from "@/types/chat";
import { ReactNode, useEffect, useRef, useState } from "react";
import { ChatInput } from "./chat-input";
import { MessageList } from "./message-list";
import { Suggestions } from "./suggestions";
import { useChat } from "@ai-sdk/react";
import { INITIAL_MESSAGE } from "./constants";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithApprovalResponses,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { toast } from "sonner";
import { useCart } from "@/providers/cart-provider";
import { useAuth } from "@/hooks/use-auth";
import { useChatProvider } from "@/providers/chat-provider";
import { ResetChatModal } from "./reset-chat-modal";
import { MessagesCounterAndResetChatButton } from "./messages-counter-and-reset-chat-button";
import { AiCapabilitiesModal } from "./ai-capabilities-modal";

export function Chat(): ReactNode {
  const { isAuthenticated } = useAuth();
  const { mutate: mutateCart } = useCart();
  const { persistedMessages, setPersistedMessages, resetChatSession } =
    useChatProvider();
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [isCapabilitiesModalOpen, setIsCapabilitiesModalOpen] =
    useState<boolean>(false);

  const {
    messages,
    sendMessage,
    status,
    setMessages,
    error,
    addToolOutput,
    stop: abort,
    addToolApprovalResponse,
  } = useChat<MessageType>({
    transport: new DefaultChatTransport({
      api: "/api/ai/ai-assistant",
    }),
    sendAutomaticallyWhen: (messages) =>
      lastAssistantMessageIsCompleteWithToolCalls(messages) ||
      lastAssistantMessageIsCompleteWithApprovalResponses(messages),
    // run client-side tools that are automatically executed:
    async onToolCall({ toolCall }) {
      // Check if it's a dynamic tool first for proper type narrowing
      if (toolCall.dynamic) {
        return;
      }

      // Handle `revalidateFrontendCart`
      if (toolCall.toolName === "revalidateFrontendCart") {
        // Revalidate the cart data
        mutateCart()
          .then(() => {
            toast.success("Cart updated successfully! 🛒", {
              description:
                "Your cart has been refreshed with the latest items.",
            });
          })
          .catch((error) => {
            console.error("Failed to revalidate cart:", error);
            toast.error("Failed to update cart", {
              description:
                "There was an issue refreshing your cart. Please try again.",
            });
          });

        // Add tool result
        addToolOutput({
          tool: "revalidateFrontendCart",
          toolCallId: toolCall.toolCallId,
          output: true,
        });
      }
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    },
  });

  const prevStatusRef = useRef<string | undefined>(undefined);
  const isInitialMount = useRef<boolean>(true);

  // On mount, restore messages from provider
  useEffect(() => {
    if (isInitialMount.current && persistedMessages.length > 0) {
      setMessages(persistedMessages);
      isInitialMount.current = false;
    }
  }, []);

  // Sync messages to provider whenever they change (for persistence across sheet open/close)
  useEffect(() => {
    if (!isInitialMount.current) {
      setPersistedMessages(messages);
    }
  }, [messages, setPersistedMessages]);

  // Handle loading messages when status changes to "submitted"
  useEffect(() => {
    const prevStatus = prevStatusRef.current;
    prevStatusRef.current = status;

    // When status changes to "submitted", add loading message
    if (status === "submitted" && prevStatus !== "submitted") {
      const loadingMessage: MessageType = {
        id: `loading-${Date.now()}`,
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Let me think about that for a moment... 🤔",
          },
        ],
      };

      setMessages((prevMessages) => [...prevMessages, loadingMessage]);
    }

    // When status changes from "submitted" to something else, remove loading message
    if (prevStatus === "submitted" && status !== "submitted") {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => !msg.id.startsWith("loading-")),
      );
    }
  }, [status, setMessages]);

  // Handle errors by displaying them as AI assistant messages
  useEffect(() => {
    if (error) {
      const errorMessage: MessageType = {
        id: `error-${Date.now()}`,
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `I'm sorry, but I encountered an error: ${error.message || "An unexpected error occurred"}. Please try again or contact support if the issue persists.`,
          },
        ],
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  }, [error, setMessages]);

  const addUserMessage = (content: string) => {
    const userMessage: MessageType = {
      id: `user-${Date.now()}`,
      role: "user",
      parts: [
        {
          type: "text",
          text: content,
        },
      ],
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
  };

  const handleMessageSubmit = async (message: string) => {
    addUserMessage(message);
    await sendMessage();
  };

  const handleSuggestionClick = async (suggestion: string) => {
    addUserMessage(suggestion);
    await sendMessage();
  };

  // Deduplicate messages by ID - keep only the last occurrence of each ID
  // This fixes the issue where client-side tools cause message duplication
  const deduplicatedMessages = messages.reduce((acc, message) => {
    const existingIndex = acc.findIndex((m) => m.id === message.id);
    if (existingIndex !== -1) {
      // Replace existing message with the newer one (which has more parts)
      acc[existingIndex] = message;
    } else {
      acc.push(message);
    }
    return acc;
  }, [] as MessageType[]);

  const handleResetChat = () => {
    setIsResetModalOpen(true);
  };

  const handleShowCapabilities = () => {
    setIsCapabilitiesModalOpen(true);
  };

  const confirmResetChat = () => {
    // Reset both local and persisted messages
    setMessages(INITIAL_MESSAGE);
    resetChatSession();
    toast.success("Chat session cleared", {
      description: "You can now start a fresh conversation.",
    });
  };

  return (
    <div className="relative flex size-full flex-col divide-y overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <MessagesCounterAndResetChatButton
          messages={deduplicatedMessages}
          isAuthenticated={isAuthenticated}
          status={status}
          handleResetChat={handleResetChat}
          handleShowCapabilities={handleShowCapabilities}
        />
        <MessageList
          status={status}
          messages={deduplicatedMessages}
          addToolOutput={addToolOutput}
          addToolApprovalResponse={addToolApprovalResponse}
          isAuthenticated={isAuthenticated}
        />
      </div>
      <div className="grid shrink-0 gap-4 pt-4">
        <Suggestions
          disabled={!isAuthenticated}
          onSuggestionClick={handleSuggestionClick}
          status={status}
        />
        <ChatInput
          disabled={!isAuthenticated}
          onSubmit={handleMessageSubmit}
          onCancel={abort}
          status={status}
        />
      </div>

      <ResetChatModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={confirmResetChat}
      />

      <AiCapabilitiesModal
        isOpen={isCapabilitiesModalOpen}
        onClose={() => setIsCapabilitiesModalOpen(false)}
      />
    </div>
  );
}

export default Chat;
