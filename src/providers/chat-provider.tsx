"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { MessageType } from "@/types/chat";
import { INITIAL_MESSAGE } from "@/components/chatbot/constants";

interface ChatContextType {
  persistedMessages: MessageType[];
  setPersistedMessages: (messages: MessageType[]) => void;
  resetChatSession: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({
  children,
}: Readonly<{ children: ReactNode }>): ReactNode {
  const [persistedMessages, setPersistedMessages] =
    useState<MessageType[]>(INITIAL_MESSAGE);

  const resetChatSession = () => {
    setPersistedMessages(INITIAL_MESSAGE);
  };

  return (
    <ChatContext.Provider
      value={{
        persistedMessages,
        setPersistedMessages,
        resetChatSession,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatProvider(): ChatContextType {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatProvider must be used within ChatProvider");
  }
  return context;
}
