"use client";

import { MessageFrom, MessageType } from "@/types/chat";
import { nanoid } from "nanoid";
import { useState } from "react";
import { ChatInput } from "./chat-input";
import { MessageList } from "./message-list";
import { Suggestions } from "./suggestions";

const initialMessages: MessageType[] = [
  {
    key: nanoid(),
    from: MessageFrom.ASSISTANT,
    versions: [
      {
        id: nanoid(),
        content:
          "Hello, I'm AI-Riper! How can I assist you today? Want to get product recommendations or help with reviews? Maybe you want to get the most liked products? Let me know what you need!",
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
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);

  const addUserMessage = (content: string) => {
    const userMessage: MessageType = {
      key: `user-${Date.now()}`,
      from: MessageFrom.USER,
      versions: [
        {
          id: `user-${Date.now()}`,
          content,
        },
      ],
      avatar:
        "https://av26f7xvv9.ufs.sh/f/AlYD1nttismZARVXxgttismZVBg5TPXqkj63Uu4yF9CfvlLH",
      name: "You",
    };

    setMessages((prev) => [...prev, userMessage]);
  };

  const handleMessageSubmit = (message: string) => {
    addUserMessage(message);
    // TODO: Implement actual API call to send message to backend
  };

  const handleSuggestionClick = (suggestion: string) => {
    addUserMessage(suggestion);
    // TODO: Implement actual API call to send suggestion to backend
  };

  return (
    <div className="relative flex size-full flex-col divide-y overflow-hidden">
      <MessageList messages={messages} />
      <div className="grid shrink-0 gap-4 pt-4">
        <Suggestions
          suggestions={suggestions}
          onSuggestionClick={handleSuggestionClick}
        />
        <ChatInput onSubmit={handleMessageSubmit} />
      </div>
    </div>
  );
};

export default Chat;
