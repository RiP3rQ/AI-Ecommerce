"use client";

import { Button } from "../ui/button";

interface SuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

export const Suggestions = ({
  suggestions,
  onSuggestionClick,
}: SuggestionsProps) => {
  return (
    <div className="flex flex-wrap gap-2 px-4">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion}
          onClick={() => onSuggestionClick(suggestion)}
          className="rounded-full border px-4 py-2 text-sm transition-colors cursor-pointer"
          variant="secondary"
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
};
