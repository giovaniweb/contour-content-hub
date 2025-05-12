
import React, { useState, useEffect } from 'react';
import CommandInput from './CommandInput';
import SuggestionsList from './SuggestionsList';
import { AuroraCommandPaletteProps } from './types';
import AuroraBackground from './AuroraBackground';
import NeonStyles from './NeonStyles';

const defaultSuggestions = [
  "Criar estratégia de conteúdo",
  "O que posso postar hoje?",
  "Ideias para engajamento no Instagram",
  "Como criar um roteiro para vídeo",
  "Conteúdo para profissionais da medicina estética",
  "Estratégias para Instagram sobre estética avançada"
];

const AuroraCommandPalette: React.FC<AuroraCommandPaletteProps> = ({
  onSubmit,
  className,
  suggestions = defaultSuggestions,
  placeholder = "Digite sua consulta ou comando...",
  initialValue = "",
  showHistory = true
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [history, setHistory] = useState<string[]>([]);
  const [typingText, setTypingText] = useState("");
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Animation for typing effect
  useEffect(() => {
    if (!isFocused && suggestions.length > 0) {
      const currentExample = suggestions[currentPlaceholderIndex];
      
      if (isTyping) {
        if (typingText.length < currentExample.length) {
          const timeoutId = setTimeout(() => {
            setTypingText(currentExample.substring(0, typingText.length + 1));
          }, 100);
          return () => clearTimeout(timeoutId);
        } else {
          setIsTyping(false);
          const timeoutId = setTimeout(() => {
            setIsTyping(true);
            setTypingText("");
            setCurrentPlaceholderIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
          }, 2000);
          return () => clearTimeout(timeoutId);
        }
      }
    }
  }, [typingText, isTyping, currentPlaceholderIndex, suggestions, isFocused]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (inputValue.trim()) {
      if (onSubmit) {
        onSubmit(inputValue);
      }
      
      // Add to history if not already there
      if (!history.includes(inputValue)) {
        setHistory((prev) => [inputValue, ...prev].slice(0, 5));
      }
      
      setInputValue("");
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for suggestion clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const displayPlaceholder = !inputValue && !isFocused ? typingText : placeholder;

  return (
    <div className={className}>
      <CommandInput 
        inputValue={inputValue}
        setInputValue={setInputValue}
        displayPlaceholder={displayPlaceholder}
        handleSubmit={handleSubmit}
        handleFocus={handleFocus}
        handleBlur={handleBlur}
        isFocused={isFocused}
        typingText={typingText}
        inputValue1={inputValue}
      />
      
      {showSuggestions && (
        <SuggestionsList 
          suggestions={showHistory && history.length > 0 ? 
            [...new Set([...history, ...suggestions.filter(s => !history.includes(s)).slice(0, 5 - history.length)])] :
            suggestions.slice(0, 5)
          }
          onSuggestionClick={handleSuggestionClick}
        />
      )}
      
      <NeonStyles />
    </div>
  );
};

export default AuroraCommandPalette;
