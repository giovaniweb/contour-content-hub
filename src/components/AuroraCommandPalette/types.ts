
import React from 'react';

export interface AuroraCommandPaletteProps {
  onSubmit?: (value: string) => void;
  className?: string;
  suggestions?: string[];
  placeholder?: string;
  initialValue?: string;
  showHistory?: boolean;
}

export interface CommandInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  displayPlaceholder: string;
  handleSubmit: (e?: React.FormEvent) => void;
  handleFocus: () => void;
  handleBlur: () => void;
  isFocused: boolean;
  typingText: string;
  inputValue1: string;
}

export interface SuggestionsListProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}
