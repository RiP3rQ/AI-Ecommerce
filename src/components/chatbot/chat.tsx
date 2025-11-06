"use client";

import type { MessageType } from "@/types/chat";
import { useEffect, useRef } from "react";
import { ChatInput } from "./chat-input";
import { MessageList } from "./message-list";
import { Suggestions } from "./suggestions";
import { useChat } from "@ai-sdk/react";
import { FilteredChatTransport } from "./custom-api-transporter";
import { INITIAL_MESSAGE } from "./constants";

export const Chat = () => {
  const { messages, sendMessage, status, setMessages, error } =
    useChat<MessageType>({
      transport: new FilteredChatTransport({
        api: "/api/ai/ai-assistant",
      }),
      messages: INITIAL_MESSAGE,
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

  return (
    <div className="relative flex size-full flex-col divide-y overflow-hidden">
      <MessageList messages={messages} status={status} />
      <div className="grid shrink-0 gap-4 pt-4">
        <Suggestions
          onSuggestionClick={handleSuggestionClick}
          status={status}
        />
        <ChatInput onSubmit={handleMessageSubmit} status={status} />
      </div>
    </div>
  );
};

export default Chat;
