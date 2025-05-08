
import React, { useEffect, useState } from 'react';

interface TypingAnimationProps {
  phrases: string[];
  typingInterval?: number;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({ 
  phrases, 
  typingInterval = 3000 
}) => {
  const [typingText, setTypingText] = useState(phrases[0]);
  
  useEffect(() => {
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % phrases.length;
      setTypingText(phrases[currentIndex]);
    }, typingInterval);
    
    return () => clearInterval(interval);
  }, [phrases, typingInterval]);

  return (
    <div className="h-12 flex items-center justify-center">
      <p className="text-2xl text-primary font-medium typing-animation">
        {typingText}
      </p>
    </div>
  );
};

export default TypingAnimation;
