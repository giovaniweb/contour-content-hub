
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HeroSearchProps {
  onSearch: (query: string) => void;
  suggestions?: string[];
  placeholder?: string;
}

const HeroSearch: React.FC<HeroSearchProps> = ({
  onSearch,
  suggestions = [
    "Crie roteiro para vídeo sobre rejuvenescimento facial",
    "Estratégias para Instagram sobre estética avançada",
    "Conteúdo para profissionais da medicina estética",
    "Ideias para promover tratamento de criolipólise",
    "Como criar conteúdo para atrair clientes de procedimentos estéticos",
  ],
  placeholder = "Digite sua consulta ou comando..."
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        className="relative rounded-2xl overflow-hidden shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ boxShadow: "0 0 15px rgba(120, 120, 255, 0.3)" }}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50"></div>
        
        <form 
          onSubmit={handleSubmit}
          className="relative backdrop-blur border border-white/20 rounded-2xl px-4 py-4"
        >
          <div className="flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={!isFocused && !query ? typingText : placeholder}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="flex-grow bg-transparent text-gray-800 p-3 outline-none placeholder:text-gray-500 text-lg font-montserrat"
            />
            <motion.button
              type="submit"
              whileTap={{ scale: 0.95 }}
              className="relative bg-gradient-to-r from-blue-400 to-purple-400 text-white p-3 rounded-full transition-colors"
            >
              <Send className="h-5 w-5" />
              {/* Pulsing neon effect around button */}
              <motion.div
                className="absolute inset-0 rounded-full z-[-1]"
                animate={{ 
                  boxShadow: ['0 0 0px rgba(120, 120, 255, 0.4)', '0 0 10px rgba(120, 120, 255, 0.8)', '0 0 0px rgba(120, 120, 255, 0.4)'],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </motion.button>
          </div>

          {/* Focus ring animation */}
          {isFocused && (
            <motion.div
              className="absolute inset-0 rounded-2xl z-[-1]"
              initial={{ opacity: 0.5 }}
              animate={{ 
                boxShadow: ['0 0 0px rgba(120, 120, 255, 0.2)', '0 0 10px rgba(120, 120, 255, 0.6)', '0 0 0px rgba(120, 120, 255, 0.2)'],
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
      
      {/* Suggestions - Only show when input is focused */}
      {isFocused && (
        <motion.div 
          className="mt-4 p-4 rounded-xl relative"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {/* Gradient border effect for container */}
          <div className="absolute inset-0 rounded-xl border border-transparent bg-gradient-to-r from-fluida-blue/30 to-fluida-pink/30 p-0.5">
            <div className="absolute inset-0 rounded-[calc(0.75rem-1px)] bg-white/95"></div>
          </div>
          
          <div className="relative flex flex-wrap gap-3 justify-center">
            <AnimatePresence>
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(155, 135, 245, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="rounded-full border border-purple-200 shadow-sm hover:shadow-md transition-all bg-white/80"
                >
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer py-2 px-4 bg-transparent backdrop-blur border-0 hover:bg-purple-50/50 font-montserrat text-gray-700"
                  >
                    {suggestion}
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
      
      {/* Custom styling */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap');
          
          .font-montserrat {
            font-family: 'Montserrat', sans-serif;
          }
          
          /* Pulse animation for send button on hover */
          @keyframes pulse-glow {
            0% {
              box-shadow: 0 0 5px rgba(120, 120, 255, 0.2);
            }
            50% {
              box-shadow: 0 0 15px rgba(120, 120, 255, 0.5);
            }
            100% {
              box-shadow: 0 0 5px rgba(120, 120, 255, 0.2);
            }
          }
        `}
      </style>
    </div>
  );
};

export default HeroSearch;
