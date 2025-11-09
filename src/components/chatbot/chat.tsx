"use client";

import type { MessageType } from "@/types/chat";
import { useEffect, useRef } from "react";
import { ChatInput } from "./chat-input";
import { MessageList } from "./message-list";
import { Suggestions } from "./suggestions";
import { useChat } from "@ai-sdk/react";
import { INITIAL_MESSAGE } from "./constants";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
  tool,
} from "ai";
import { toast } from "sonner";
import { useCart } from "@/providers/cart-provider";

export const Chat = () => {
  const { mutate: mutateCart } = useCart();
  const {
    messages,
    sendMessage,
    status,
    setMessages,
    error,
    addToolResult,
    stop: abort,
  } = useChat<MessageType>({
    transport: new DefaultChatTransport({
      api: "/api/ai/ai-assistant",
    }),
    messages: INITIAL_MESSAGE,
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
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
        addToolResult({
          tool: "revalidateFrontendCart",
          toolCallId: toolCall.toolCallId,
          output: true,
        });
      }
    },
  });

  const prevStatusRef = useRef<string | undefined>(undefined);

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

  return (
    <div className="relative flex size-full flex-col divide-y overflow-hidden">
      <MessageList
        messages={deduplicatedMessages}
        status={status}
        addToolResult={addToolResult}
      />
      <div className="grid shrink-0 gap-4 pt-4">
        <Suggestions
          onSuggestionClick={handleSuggestionClick}
          status={status}
        />
        <ChatInput
          onSubmit={handleMessageSubmit}
          onCancel={abort}
          status={status}
        />
      </div>
    </div>
  );
};

export default Chat;
