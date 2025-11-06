"use client";

import type { MessageType } from "@/types/chat";
import { nanoid } from "nanoid";
import { useEffect } from "react";
import { ChatInput } from "./chat-input";
import { MessageList } from "./message-list";
import { Suggestions } from "./suggestions";
import { useChat } from "@ai-sdk/react";
import { FilteredChatTransport } from "./custom-api-transporter";

const initialMessage: MessageType[] = [
  {
    id: nanoid(),
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "Hello, I'm AI-Riper! How can I assist you today? Want to get product recommendations or help with reviews? Maybe you want to get the most liked products? Let me know what you need!",
      },
    ],
  },
];

const suggestions = [
  "Show me most liked products!",
  "Show me all the hoodies I can buy",
  "Show me all the pants I can buy",
  "Show me all the shoes I can buy",
  "Show me all the accessories I can buy",
];

export const Chat = () => {
  const { messages, sendMessage, status, setMessages, error } = useChat<MessageType>({
    transport: new FilteredChatTransport({
      api: "/api/ai/ai-assistant",
    }),
    messages: initialMessage,
  });

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
          suggestions={suggestions}
          onSuggestionClick={handleSuggestionClick}
          status={status}
        />
        <ChatInput onSubmit={handleMessageSubmit} status={status} />
      </div>
    </div>
  );
};

export default Chat;
