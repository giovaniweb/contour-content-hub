
import React from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { typingCursorVariants } from '@/lib/animations';
import AuroraBackground from './AuroraBackground';
import { CommandInputProps } from './types';
import { cn } from '@/lib/utils';

const CommandInput: React.FC<CommandInputProps> = ({
  inputValue,
  setInputValue,
  displayPlaceholder,
  handleSubmit,
  handleFocus,
  handleBlur,
  isFocused,
  typingText,
  inputValue1
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden shadow-xl transition-all w-full max-w-3xl mx-auto py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ boxShadow: "0 0 15px rgba(120, 120, 255, 0.4)" }}
    >
      <AuroraBackground />
      
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
            className={cn(
              "flex-grow bg-transparent text-foreground p-3 outline-none placeholder:text-muted-foreground text-lg neon-text"
            )}
          />
          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            className="relative bg-fluida-pink hover:bg-fluida-pink/80 text-white p-3 rounded-full transition-colors"
          >
            <Send className="h-5 w-5" />
            {/* Pulsing neon effect around button */}
            <motion.div
              className="absolute inset-0 rounded-full z-[-1]"
              animate={{ 
                boxShadow: ['0 0 0px rgba(255, 153, 204, 0.4)', '0 0 10px rgba(255, 153, 204, 0.8)', '0 0 0px rgba(255, 153, 204, 0.4)'],
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

        {/* Typing cursor animation when input is empty */}
        {!inputValue1 && !isFocused && (
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
  );
};

export default CommandInput;
