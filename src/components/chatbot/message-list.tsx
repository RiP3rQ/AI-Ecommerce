"use client";

import { MessageFrom, MessageType } from "@/types/chat";
import { UIMessage, UIDataTypes, UITools } from "ai";
import Image from "next/image";

interface MessageListProps {
  messages: MessageType[];
}

const MessageBubble = ({ message }: Readonly<{ message: MessageType }>) => {
  const isUser = message.role === "user";
  const content =
    message.parts.find((part) => part.type === "text")?.text || "";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <Image
          src={message.avatar}
          alt={message.name}
          width={32}
          height={32}
          className="h-8 w-8 rounded-full"
        />
      )}
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg ${isUser ? "order-first" : ""}`}
      >
        <div className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          {message.name}
        </div>
        <div
          className={`rounded-lg px-4 py-2 ${
            isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
          }`}
        >
          {content}
        </div>
      </div>
      {isUser && (
        <Image
          src={message.avatar}
          alt={message.name}
          width={32}
          height={32}
          className="h-8 w-8 rounded-full"
        />
      )}
    </div>
  );
};

export const MessageList = ({ messages }: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
};
