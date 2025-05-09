
import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

interface InteractivePromptProps {
  phrases: string[];
  onSubmit: (prompt: string) => void;
  intervalSpeed?: number;
}

const InteractivePrompt: React.FC<InteractivePromptProps> = ({
  phrases,
  onSubmit,
  intervalSpeed = 3000
}) => {
  const [currentPhrase, setCurrentPhrase] = useState(phrases[0]);
  const [prompt, setPrompt] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cycle through phrases
  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % phrases.length;
        setCurrentPhrase(phrases[newIndex]);
        return newIndex;
      });
    }, intervalSpeed);

    return () => clearInterval(interval);
  }, [phrases, intervalSpeed]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt.trim());
      setPrompt('');
    }
  };

  // Focus input on click anywhere in container
  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div 
      className="typing-container" 
      onClick={handleContainerClick}
      role="presentation"
    >
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="typing-input"
            placeholder={currentPhrase}
            aria-label="Type your prompt"
          />
          <button 
            type="submit"
            className="submit-button"
            aria-label="Submit prompt"
            disabled={!prompt.trim()}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default InteractivePrompt;
