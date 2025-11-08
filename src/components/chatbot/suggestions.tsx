"use client";

import { useMemo } from "react";
import { Button } from "../ui/button";
import type { ChatStatus } from "ai";
import { SUGGESTION_PROMPTS } from "./constants";

interface SuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
  status: ChatStatus;
  disabled?: boolean;
}

export const Suggestions = ({
  onSuggestionClick,
  status,
  disabled,
}: SuggestionsProps) => {
  const isDisabled = useMemo(() => {
    return disabled || status !== "ready";
  }, [disabled, status]);

  return (
    <div className="flex flex-wrap gap-2 px-4">
      {SUGGESTION_PROMPTS.map((suggestion: string) => (
        <Button
          key={suggestion}
          onClick={() => onSuggestionClick(suggestion)}
          className="rounded-full border px-4 py-2 text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          variant="secondary"
          disabled={isDisabled}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
};
