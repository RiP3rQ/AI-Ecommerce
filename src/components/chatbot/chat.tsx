"use client";

import { MessageFrom, MessageType } from "@/types/chat";
import { nanoid } from "nanoid";
import { useState } from "react";
import { ChatInput } from "./chat-input";
import { MessageList } from "./message-list";
import { Suggestions } from "./suggestions";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

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
    avatar:
      "https://av26f7xvv9.ufs.sh/f/AlYD1nttismZ2zwtbIxJimuCRrYEZHOy8enaxStjXV7TMdcq",
    name: "AI-Riper",
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
  const { messages, sendMessage, status, setMessages } = useChat<MessageType>({
    transport: new DefaultChatTransport({
      api: "/api/ai/ai-assistant",
    }),
    messages: initialMessage,
  });

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
      avatar:
        "https://av26f7xvv9.ufs.sh/f/AlYD1nttismZARVXxgttismZVBg5TPXqkj63Uu4yF9CfvlLH",
      name: "You",
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
      <MessageList messages={messages} />
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
