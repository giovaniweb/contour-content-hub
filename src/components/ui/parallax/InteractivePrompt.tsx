
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface InteractivePromptProps {
  phrases: string[];
  onSubmit: (prompt: string) => void;
  className?: string;
}

const InteractivePrompt: React.FC<InteractivePromptProps> = ({
  phrases,
  onSubmit,
  className = '',
}) => {
  const [currentPhrase, setCurrentPhrase] = useState(phrases[0]);
  const [isTyping, setIsTyping] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isInputActive, setIsInputActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingInterval = useRef<NodeJS.Timeout | null>(null);

  // Handle phrase rotation
  useEffect(() => {
    if (!isInputActive) {
      typingInterval.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        setIsTyping(true);
      }, 4000);
    }

    return () => {
      if (typingInterval.current) {
        clearInterval(typingInterval.current);
      }
    };
  }, [phrases, isInputActive]);

  // Update current phrase when index changes
  useEffect(() => {
    setCurrentPhrase(phrases[currentIndex]);
  }, [currentIndex, phrases]);

  // Stop typing animation after it completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentPhrase]);

  const handleInputFocus = () => {
    setIsInputActive(true);
    if (typingInterval.current) {
      clearInterval(typingInterval.current);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      onSubmit(userInput);
      setUserInput('');
    }
  };

  return (
    <div className={`max-w-xl mx-auto ${className}`}>
      {/* Animated typing effect */}
      <AnimatePresence mode="wait">
        {!isInputActive && (
          <motion.div 
            key="typing"
            className="h-16 flex items-center justify-center mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-xl md:text-2xl text-white font-light relative">
              <span>{currentPhrase}</span>
              {isTyping && (
                <motion.span
                  className="absolute -right-1 w-0.5 h-6 bg-white"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onFocus={handleInputFocus}
          placeholder={isInputActive ? "Type what you want to do..." : ""}
          className="pl-4 pr-12 py-6 rounded-full bg-white/90 backdrop-blur-sm border-0 shadow-lg text-gray-800 placeholder:text-gray-400 w-full"
        />
        <Button 
          type="submit" 
          size="icon" 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-fluida-blue hover:bg-fluida-blueDark"
        >
          <Send size={18} className="text-white" />
        </Button>
      </form>
    </div>
  );
};

export default InteractivePrompt;
