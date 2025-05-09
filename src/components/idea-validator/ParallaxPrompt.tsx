
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";
import { typingCursorVariants } from '@/lib/animations';

interface ParallaxPromptProps {
  onSubmit: (idea: string) => void;
  isSubmitting: boolean;
}

const PlaceholderExamples = [
  "Vídeo com massinha para o Dia das Mães",
  "Bastidores da clínica antes da abertura",
  "Tutorial de skincare com paciente real",
  "Antes e depois de preenchimento labial",
  "Vídeo explicando a tecnologia do equipamento",
  "Depoimento de cliente satisfeito"
];

const ParallaxPrompt: React.FC<ParallaxPromptProps> = ({ onSubmit, isSubmitting }) => {
  const [idea, setIdea] = useState<string>("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Handle the typing animation effect for placeholders
  useEffect(() => {
    if (!isTyping) return;
    
    const currentPlaceholder = PlaceholderExamples[placeholderIndex];
    let currentIndex = 0;
    let typingInterval: NodeJS.Timeout;
    
    // Type the text
    const typeText = () => {
      if (currentIndex < currentPlaceholder.length) {
        setDisplayText(currentPlaceholder.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        // Finished typing the current placeholder
        clearInterval(typingInterval);
        setTimeout(() => {
          // After a pause, start erasing
          setIsTyping(false);
        }, 2000);
      }
    };
    
    typingInterval = setInterval(typeText, 50);
    return () => clearInterval(typingInterval);
  }, [isTyping, placeholderIndex]);
  
  // Handle the erasing animation and switch to next placeholder
  useEffect(() => {
    if (isTyping) return;
    
    let currentText = displayText;
    let erasingInterval: NodeJS.Timeout;
    
    // Erase the text
    const eraseText = () => {
      if (currentText.length > 0) {
        setDisplayText(currentText.substring(0, currentText.length - 1));
        currentText = currentText.substring(0, currentText.length - 1);
      } else {
        // Finished erasing
        clearInterval(erasingInterval);
        // Move to next placeholder
        setPlaceholderIndex((prev) => (prev + 1) % PlaceholderExamples.length);
        setTimeout(() => {
          setIsTyping(true);
        }, 500);
      }
    };
    
    erasingInterval = setInterval(eraseText, 30);
    return () => clearInterval(erasingInterval);
  }, [displayText, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim()) {
      onSubmit(idea.trim());
    }
  };
  
  // Focus the input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          className="typing-input glow-effect"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          disabled={isSubmitting}
          placeholder={displayText}
          aria-label="Digite sua ideia aqui"
        />
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Button 
            type="submit" 
            className="submit-button" 
            disabled={!idea.trim() || isSubmitting}
            variant="ghost"
            size="icon"
            aria-label="Enviar ideia"
          >
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </form>

      <style>
        {`
        .typing-input {
          width: 100%;
          padding: 1.2rem 1.5rem;
          font-size: 1.1rem;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 30px;
          color: white;
          outline: none;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          padding-right: 4rem;
        }
        
        .typing-input:focus, .typing-input:hover {
          border-color: rgba(243, 0, 252, 0.5);
          box-shadow: 0 5px 25px rgba(243, 0, 252, 0.25);
        }
        
        .typing-input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }
        `}
      </style>
    </div>
  );
};

export default ParallaxPrompt;
