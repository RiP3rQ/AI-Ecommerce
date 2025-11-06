"use client";

import { useMemo } from "react";
import { Button } from "../ui/button";
import { ChatStatus } from "ai";

interface SuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  status: ChatStatus;
  disabled?: boolean;
}

export const Suggestions = ({
  suggestions,
  onSuggestionClick,
  status,
  disabled,
}: SuggestionsProps) => {
  const isDisabled = useMemo(() => {
    return disabled || status !== "ready";
  }, [disabled, status]);

  return (
    <div className="flex flex-wrap gap-2 px-4">
      {suggestions.map((suggestion) => (
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
