"use client";

import { type MessageType } from "@/types/chat";
import Image from "next/image";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Response } from "@/components/ai-elements/response";
import {
  AI_ASSISTANT_AVATAR_LINK,
  AI_ASSISTANT_NAME,
  USER_AVATAR_LINK,
  USER_NAME,
} from "./constants";

interface MessageListProps {
  messages: MessageType[];
  status?: string;
}

interface MessageBubbleProps {
  message: MessageType;
  status?: string;
  isLastMessage?: boolean;
}

const MessageBubble = ({
  message,
  status,
  isLastMessage,
}: MessageBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <Image
          src={AI_ASSISTANT_AVATAR_LINK}
          alt={AI_ASSISTANT_NAME}
          width={32}
          height={32}
          className="h-8 w-8 rounded-full"
        />
      )}
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg ${isUser ? "order-first" : ""}`}
      >
        <div className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          {isUser ? USER_NAME : AI_ASSISTANT_NAME}
        </div>
        <div
          className={`rounded-lg px-4 py-2 ${
            isUser
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
          }`}
        >
          {message.parts.map((part, i) => {
            switch (part.type) {
              case "text":
                return (
                  <Response key={`${message.id}-${i}`}>{part.text}</Response>
                );
              case "reasoning":
                return (
                  <Reasoning
                    key={`${message.id}-${i}`}
                    className="w-full"
                    isStreaming={
                      status === "streaming" &&
                      isLastMessage &&
                      i === message.parts.length - 1
                    }
                  >
                    <ReasoningTrigger />
                    <ReasoningContent>{part.text}</ReasoningContent>
                  </Reasoning>
                );
              default:
                return null;
            }
          })}
        </div>
      </div>
      {isUser && (
        <Image
          src={USER_AVATAR_LINK}
          alt={USER_NAME}
          width={32}
          height={32}
          className="h-8 w-8 rounded-full"
        />
      )}
    </div>
  );
};

export const MessageList = ({ messages, status }: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            status={status}
            isLastMessage={index === messages.length - 1}
          />
        ))}
      </div>
    </div>
  );
};
