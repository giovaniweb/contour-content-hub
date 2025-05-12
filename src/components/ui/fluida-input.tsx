
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface FluidaInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  multiline?: boolean;
  rows?: number;
  iconRight?: React.ReactNode;
  animatedPlaceholder?: string[];
  className?: string;
}

export const FluidaInput = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, FluidaInputProps>(
  ({ label, multiline = false, rows = 3, iconRight, animatedPlaceholder, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [typingText, setTypingText] = useState("");
    const [isTyping, setIsTyping] = useState(true);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    
    // Merge refs
    const mergedRef = (node: HTMLInputElement | HTMLTextAreaElement) => {
      // Forward the ref
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement | null>).current = node;
      }
      
      // Set our local ref
      inputRef.current = node;
    };
    
    // Handle typing animation for placeholder
    useEffect(() => {
      if (!animatedPlaceholder || animatedPlaceholder.length === 0 || props.value) return;
      
      const currentPlaceholder = animatedPlaceholder[placeholderIndex];
      
      if (isTyping) {
        if (typingText.length < currentPlaceholder.length) {
          const timeout = setTimeout(() => {
            setTypingText(currentPlaceholder.substring(0, typingText.length + 1));
          }, 100);
          return () => clearTimeout(timeout);
        } else {
          setIsTyping(false);
          const timeout = setTimeout(() => {
            setIsTyping(true);
            setTypingText("");
            setPlaceholderIndex((placeholderIndex + 1) % animatedPlaceholder.length);
          }, 2000);
          return () => clearTimeout(timeout);
        }
      }
    }, [animatedPlaceholder, typingText, isTyping, placeholderIndex, props.value]);
    
    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(true);
      if (props.onFocus) props.onFocus(e);
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(false);
      if (props.onBlur) props.onBlur(e);
    };
    
    const displayedPlaceholder = animatedPlaceholder && !props.value && !isFocused
      ? typingText
      : props.placeholder;
    
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {multiline ? (
            <Textarea
              {...props as React.TextareaHTMLAttributes<HTMLTextAreaElement>}
              ref={mergedRef as React.Ref<HTMLTextAreaElement>}
              rows={rows}
              placeholder={displayedPlaceholder as string}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={cn(
                "w-full bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-lg transition-all duration-300",
                "focus:ring-2 focus:ring-fluida-blue/30 focus:border-fluida-blue/50 focus:shadow-[0_0_15px_rgba(0,148,251,0.3)]",
                "hover:shadow-[0_0_10px_rgba(0,148,251,0.2)]",
                "placeholder:text-gray-400 placeholder:transition-colors placeholder:duration-300",
                "focus:placeholder:text-fluida-blue/40",
                className
              )}
            />
          ) : (
            <Input
              {...props as React.InputHTMLAttributes<HTMLInputElement>}
              ref={mergedRef as React.Ref<HTMLInputElement>}
              placeholder={displayedPlaceholder as string}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={cn(
                "w-full bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-lg transition-all duration-300",
                "focus:ring-2 focus:ring-fluida-blue/30 focus:border-fluida-blue/50 focus:shadow-[0_0_15px_rgba(0,148,251,0.3)]",
                "hover:shadow-[0_0_10px_rgba(0,148,251,0.2)]",
                "placeholder:text-gray-400 placeholder:transition-colors placeholder:duration-300",
                "focus:placeholder:text-fluida-blue/40",
                "pr-10",
                className
              )}
            />
          )}
          {iconRight && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-fluida-blue transition-colors cursor-pointer">
              {iconRight}
            </div>
          )}
          {isFocused && !iconRight && (
            <motion.div 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-fluida-blue"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Send className="h-4 w-4" />
            </motion.div>
          )}
        </div>
      </div>
    );
  }
);

FluidaInput.displayName = "FluidaInput";
