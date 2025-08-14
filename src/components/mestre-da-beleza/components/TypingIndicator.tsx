import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles } from 'lucide-react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex gap-4">
      <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
        <AvatarImage src="/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png" />
        <AvatarFallback className="bg-primary/10">
          <Sparkles className="h-4 w-4 text-primary" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="inline-block bg-muted/30 border border-border/50 rounded-2xl px-4 py-3">
          <div className="flex items-center gap-1">
            <div 
              className="w-2 h-2 bg-white/60 rounded-full animate-bounce" 
              style={{ animationDelay: '0ms' }}
            />
            <div 
              className="w-2 h-2 bg-white/60 rounded-full animate-bounce" 
              style={{ animationDelay: '150ms' }}
            />
            <div 
              className="w-2 h-2 bg-white/60 rounded-full animate-bounce" 
              style={{ animationDelay: '300ms' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;