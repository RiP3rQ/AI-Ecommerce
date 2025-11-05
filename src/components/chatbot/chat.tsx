"use client";

import {
  Branch,
  BranchMessages,
  BranchNext,
  BranchPage,
  BranchPrevious,
  BranchSelector,
} from "@/components/ai-elements/branch";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Response } from "@/components/ai-elements/response";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { MessageFrom, MessageType } from "@/types/chat";
import { GlobeIcon, MicIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { models } from "tokenlens";

const initialMessages: MessageType[] = [
  {
    key: nanoid(),
    from: MessageFrom.ASSISTANT,
    versions: [
      {
        id: nanoid(),
        content:
          "Hello, I'm AI-Riper! How can I assist you today? What to get product recommendations or help with reviews? Maybe you want to get the most liked products? Let me know what you need!",
      },
    ],
    avatar:
      "https://av26f7xvv9.ufs.sh/f/AlYD1nttismZ2zwtbIxJimuCRrYEZHOy8enaxStjXV7TMdcq",
    name: "AI-Riper",
  },
];

const suggestions = [
  "How me most liked products!",
  "Show me all the hoodies I can buy",
  "Show me all the pants I can buy",
  "Show me all the shoes I can buy",
  "Show me all the accessories I can buy",
];

const Example = () => {
  const [model, setModel] = useState<string>(models[0].id);
  const [text, setText] = useState<string>("");
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null,
  );

  const streamResponse = useCallback(
    async (messageId: string, content: string) => {
      setStatus("streaming");
      setStreamingMessageId(messageId);

      const words = content.split(" ");
      let currentContent = "";

      for (let i = 0; i < words.length; i++) {
        currentContent += (i > 0 ? " " : "") + words[i];

        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.versions.some((v) => v.id === messageId)) {
              return {
                ...msg,
                versions: msg.versions.map((v) =>
                  v.id === messageId ? { ...v, content: currentContent } : v,
                ),
              };
            }
            return msg;
          }),
        );

        await new Promise((resolve) =>
          setTimeout(resolve, Math.random() * 100 + 50),
        );
      }

      setStatus("ready");
      setStreamingMessageId(null);
    },
    [],
  );

  const addUserMessage = useCallback(
    (content: string) => {
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

      //   setTimeout(() => {
      //     const assistantMessageId = `assistant-${Date.now()}`;
      //     const randomResponse =
      //       mockResponses[Math.floor(Math.random() * mockResponses.length)];

      //     const assistantMessage: MessageType = {
      //       key: `assistant-${Date.now()}`,
      //       from: "assistant",
      //       versions: [
      //         {
      //           id: assistantMessageId,
      //           content: "",
      //         },
      //       ],
      //       avatar: "https://github.com/openai.png",
      //       name: "Assistant",
      //     };

      //     setMessages((prev) => [...prev, assistantMessage]);
      //     streamResponse(assistantMessageId, randomResponse);
      //   }, 500);
    },
    [streamResponse],
  );

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    setStatus("submitted");

    if (message.files?.length) {
      toast.success("Files attached", {
        description: `${message.files.length} file(s) attached to message`,
      });
    }

    addUserMessage(message.text || "Sent with attachments");
    setText("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setStatus("submitted");
    addUserMessage(suggestion);
  };

  return (
    <div className="relative flex size-full flex-col divide-y overflow-hidden">
      <Conversation>
        <ConversationContent>
          {messages.map(({ versions, ...message }) => (
            <Branch defaultBranch={0} key={message.key}>
              <BranchMessages>
                {versions.map((version) => (
                  <Message
                    from={message.from}
                    key={`${message.key}-${version.id}`}
                  >
                    <div>
                      {message.sources?.length && (
                        <Sources>
                          <SourcesTrigger count={message.sources.length} />
                          <SourcesContent>
                            {message.sources.map((source) => (
                              <Source
                                href={source.href}
                                key={source.href}
                                title={source.title}
                              />
                            ))}
                          </SourcesContent>
                        </Sources>
                      )}
                      {message.reasoning && (
                        <Reasoning duration={message.reasoning.duration}>
                          <ReasoningTrigger />
                          <ReasoningContent>
                            {message.reasoning.content}
                          </ReasoningContent>
                        </Reasoning>
                      )}
                      <MessageContent>
                        <Response>{version.content}</Response>
                      </MessageContent>
                    </div>
                    <MessageAvatar name={message.name} src={message.avatar} />
                  </Message>
                ))}
              </BranchMessages>
            </Branch>
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="grid shrink-0 gap-4 pt-4">
        <Suggestions className="px-4">
          {suggestions.map((suggestion) => (
            <Suggestion
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              suggestion={suggestion}
            />
          ))}
        </Suggestions>
        <div className="w-full px-4 pb-4">
          <PromptInput globalDrop multiple onSubmit={handleSubmit}>
            <PromptInputBody>
              <PromptInputTextarea
                onChange={(event) => setText(event.target.value)}
                value={text}
              />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputSubmit
                disabled={!(text.trim() || status) || status === "streaming"}
                status={status}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
};

export default Example;
