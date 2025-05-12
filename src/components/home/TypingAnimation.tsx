
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TypingAnimationProps {
  phrases: string[];
  typingInterval?: number;
  className?: string;
  cursorColor?: string;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({ 
  phrases, 
  typingInterval = 3000,
  className = "text-2xl text-primary font-medium",
  cursorColor = "#0094FB"
}) => {
  const [typingText, setTypingText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const currentPhrase = phrases[phraseIndex];
    const typeSpeed = isDeleting ? 30 : 80; // Faster when deleting
    
    if (!isDeleting && typingText === currentPhrase) {
      // Wait before starting to delete
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 1500);
    } else if (isDeleting && typingText === "") {
      // Move to next phrase after deletion
      setIsDeleting(false);
      setPhraseIndex((phraseIndex + 1) % phrases.length);
      timeout = setTimeout(() => {}, 500); // Small pause before next phrase
    } else {
      // Handle typing or deleting
      timeout = setTimeout(() => {
        setTypingText(prev => {
          if (isDeleting) {
            return prev.substring(0, prev.length - 1);
          } else {
            return currentPhrase.substring(0, prev.length + 1);
          }
        });
      }, typeSpeed);
    }
    
    return () => clearTimeout(timeout);
  }, [phrases, phraseIndex, typingText, isDeleting]);

  return (
    <div className={`flex items-center ${className}`}>
      <span>{typingText}</span>
      <motion.span
        className="inline-block w-[2px] h-[1em] ml-1"
        style={{ backgroundColor: cursorColor }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default TypingAnimation;
