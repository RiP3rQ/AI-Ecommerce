"use client";

import { SendIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { chatInputSchema } from "../../schemas/chat-input-schema";

const MAX_CHARS = 1000;

interface ChatInputProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSubmit, disabled }: ChatInputProps) => {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (disabled) return;

    const trimmedText = text.trim();
    const validationResult = chatInputSchema.safeParse({
      message: trimmedText,
    });

    if (!validationResult.success) {
      setError(validationResult.error.issues[0].message);
      return;
    }

    setError(null);
    onSubmit(trimmedText);
    setText("");
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const handleTextChange = (value: string) => {
    setText(value);
    if (error && value.length <= MAX_CHARS) {
      const validationResult = chatInputSchema.safeParse({
        message: value.trim(),
      });
      if (validationResult.success) {
        setError(null);
      }
    }
  };

  return (
    <div className="w-full px-4 pb-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="flex-1">
            <textarea
              className={`w-full resize-none rounded-lg border px-3 py-2 focus:outline-none focus:ring-1 ${
                error
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              }`}
              placeholder="Type your message..."
              rows={3}
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
            />
            <div className="mt-1 flex items-center justify-between text-sm">
              <span
                className={
                  text.length > MAX_CHARS ? "text-red-500" : "text-gray-500"
                }
              >
                {text.length}/{MAX_CHARS}
              </span>
              {error && <span className="text-red-500">{error}</span>}
            </div>
          </div>
          <Button
            variant="secondary"
            disabled={!text.trim() || disabled || !!error}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
            type="submit"
          >
            <SendIcon size={16} />
          </Button>
        </div>
      </form>
    </div>
  );
};
