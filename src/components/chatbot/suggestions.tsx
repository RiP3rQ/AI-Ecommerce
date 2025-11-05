"use client";

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
        <button
          key={suggestion}
          onClick={() => onSuggestionClick(suggestion)}
          className="rounded-full border border-gray-300 px-4 py-2 text-sm hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};
