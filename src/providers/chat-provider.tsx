"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface ChatContextType {
  shouldResetChat: boolean;
  triggerChatReset: () => void;
  resetComplete: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({
  children,
}: Readonly<{ children: ReactNode }>): ReactNode {
  const [shouldResetChat, setShouldResetChat] = useState<boolean>(false);

  const triggerChatReset = () => {
    setShouldResetChat(true);
  };

  const resetComplete = () => {
    setShouldResetChat(false);
  };

  return (
    <ChatContext.Provider
      value={{
        shouldResetChat,
        triggerChatReset,
        resetComplete,
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
