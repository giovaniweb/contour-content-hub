
import React from 'react';
import { Button } from "@/components/ui/button";

interface SuggestedResponsesProps {
  suggestedResponses: string[];
  onSuggestion: (suggestion: string) => void;
}
const SuggestedResponses: React.FC<SuggestedResponsesProps> = ({
  suggestedResponses,
  onSuggestion
}) => (
  <div className="flex flex-wrap gap-2 my-4">
    {suggestedResponses.map((suggestion, index) => (
      <Button
        key={index}
        variant="outline"
        size="sm"
        onClick={() => onSuggestion(suggestion)}
        className="text-xs"
      >
        {suggestion}
      </Button>
    ))}
  </div>
);

export default SuggestedResponses;
