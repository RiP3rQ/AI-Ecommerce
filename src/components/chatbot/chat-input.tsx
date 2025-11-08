"use client";

import { SendIcon, XIcon } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { chatInputSchema } from "../../schemas/chat-input-schema";
import type { ChatStatus } from "ai";

const MAX_CHARS = 1000;

interface ChatInputProps {
  onSubmit: (message: string) => void;
  onCancel?: () => void;
  disabled?: boolean;
  status: ChatStatus;
}

export const ChatInput = ({
  onSubmit,
  onCancel,
  disabled,
  status,
}: Readonly<ChatInputProps>): ReactNode => {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (disabled) return;

    // Cancel any ongoing request before submitting new message
    if (status === "streaming" || status === "submitted") {
      onCancel?.();
    }

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

  const isDisabled = useMemo(() => {
    return disabled || status !== "ready";
  }, [disabled, status]);

  return (
    <div className="w-full px-4 pb-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="flex-1">
            <textarea
              className={`w-full resize-none rounded-lg border px-3 py-2 focus:outline-none focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed ${
                error
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              }`}
              placeholder="Type your message..."
              rows={3}
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isDisabled}
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
          <div className="flex gap-2">
            {(status === "streaming" || status === "submitted") && onCancel ? (
              <Button
                variant="secondary"
                onClick={onCancel}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                type="button"
                title="Cancel current request"
              >
                <XIcon size={16} />
              </Button>
            ) : (
              <Button
                variant="secondary"
                disabled={!text.trim() || isDisabled || !!error}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
                type="submit"
              >
                <SendIcon size={16} />
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
