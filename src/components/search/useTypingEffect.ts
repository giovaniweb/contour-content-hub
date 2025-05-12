
import { useState, useEffect } from 'react';

interface UseTypingEffectProps {
  suggestions: string[];
  isFocused: boolean;
  query: string;
}

export const useTypingEffect = ({ suggestions, isFocused, query }: UseTypingEffectProps) => {
  const [typingText, setTypingText] = useState('');
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  // Animation for typing effect
  useEffect(() => {
    if (!isFocused && !query) {
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
            setTypingText('');
            setCurrentPlaceholderIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
          }, 2000);
          return () => clearTimeout(timeoutId);
        }
      }
    }
  }, [typingText, isTyping, currentPlaceholderIndex, suggestions, isFocused, query]);

  return { typingText };
};
