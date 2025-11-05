"use client";

import { SendIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSubmit, disabled }: ChatInputProps) => {
  const [text, setText] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!text.trim() || disabled) return;

    onSubmit(text.trim());
    setText("");
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <div className="w-full px-4 pb-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <textarea
          className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Type your message..."
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <Button
          variant="secondary"
          disabled={!text.trim() || disabled}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
          type="submit"
        >
          <SendIcon size={16} />
        </Button>
      </form>
    </div>
  );
};
