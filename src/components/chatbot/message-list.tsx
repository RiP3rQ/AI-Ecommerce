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
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
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
  const isErrorMessage = message.id.startsWith("error-");

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
              : isErrorMessage
              ? "bg-red-50 text-red-900 border border-red-200 dark:bg-red-950 dark:text-red-100 dark:border-red-800"
              : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
          }`}
        >
          {message.parts.map((part, i) => {
            if (part.type === "text") {
              console.log("part.text", part.text);
              return (
                <Response key={`${message.id}-${i}`}>{part.text}</Response>
              );
            } else if (part.type === "reasoning") {
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
            } else if (part.type === "step-start") {
              // Skip step-start parts as they're just indicators
              return null;
            } else if (part.type.startsWith("tool-")) {
              const toolPart = part as any; // Type assertion for tool parts
              return (
                <Tool
                  key={`${message.id}-${i}`}
                  defaultOpen={
                    toolPart.state === "output-available" ||
                    toolPart.state === "output-error"
                  }
                  className="mt-4"
                >
                  <ToolHeader type={toolPart.type} state={toolPart.state} />
                  <ToolContent>
                    <ToolInput input={toolPart.input} />
                    <ToolOutput
                      output={toolPart.output}
                      errorText={toolPart.errorText}
                    />
                  </ToolContent>
                </Tool>
              );
            } else {
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
