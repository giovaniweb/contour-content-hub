
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { typingCursorVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface AuroraCommandPaletteProps {
  onSubmit?: (value: string) => void;
  className?: string;
  suggestions?: string[];
  placeholder?: string;
  initialValue?: string;
  showHistory?: boolean;
}

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
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
    <div className={cn("w-full max-w-3xl mx-auto py-4", className)}>
      <motion.div
        className="relative rounded-2xl overflow-hidden shadow-xl transition-all"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ boxShadow: "0 0 15px rgba(120, 120, 255, 0.4)" }}
      >
        {/* Aurora background effect */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="w-[200%] h-[200%] absolute -top-1/2 -left-1/2"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
            style={{
              backgroundImage: 'linear-gradient(45deg, rgba(0, 148, 251, 0.05), rgba(243, 0, 252, 0.05), rgba(111, 0, 255, 0.05), rgba(0, 255, 200, 0.05))',
              backgroundSize: '400% 400%',
              filter: 'blur(20px)',
            }}
          />
        </div>
        
        <form 
          onSubmit={handleSubmit}
          className="relative backdrop-blur border border-white/20 rounded-2xl px-4 py-4"
        >
          <div className="flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={displayPlaceholder}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="flex-grow bg-transparent text-foreground p-3 outline-none placeholder:text-muted-foreground text-lg"
            />
            <motion.button
              type="submit"
              whileTap={{ scale: 0.95 }}
              className="bg-fluida-pink hover:bg-fluida-pink/80 text-white p-3 rounded-full transition-colors"
            >
              <Send className="h-5 w-5" />
            </motion.button>
          </div>

          {/* Typing cursor animation when input is empty */}
          {!inputValue && !isFocused && (
            <motion.span
              className="inline-block w-[2px] h-[1em] bg-fluida-blue absolute bottom-6 ml-1"
              variants={typingCursorVariants}
              initial="hidden"
              animate="visible"
            />
          )}
          
          {/* Focus ring animation */}
          {isFocused && (
            <motion.div
              className="absolute inset-0 rounded-2xl z-[-1]"
              initial={{ opacity: 0.5 }}
              animate={{ 
                boxShadow: ['0 0 0px rgba(0, 148, 251, 0.2)', '0 0 10px rgba(0, 148, 251, 0.6)', '0 0 0px rgba(0, 148, 251, 0.2)'],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
              }}
            />
          )}
        </form>
      </motion.div>

      {/* Suggestions/History - Only show when focused or explicitly shown */}
      {showSuggestions && (
        <div className="mt-4 flex flex-wrap gap-2">
          <AnimatePresence>
            {(showHistory && history.length > 0 ? 
              [...new Set([...history, ...suggestions.filter(s => !history.includes(s)).slice(0, 5 - history.length)])]:
              suggestions.slice(0, 5)
            ).map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSuggestionClick(item)}
              >
                <Badge 
                  variant="outline" 
                  className="cursor-pointer py-2 px-3 bg-white/10 backdrop-blur border-white/20 hover:bg-white/20"
                >
                  {item}
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AuroraCommandPalette;
