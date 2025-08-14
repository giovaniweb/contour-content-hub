import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src="/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png" />
          <AvatarFallback className="bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted/50 border border-border'
        }`}
      >
        <div className="text-sm leading-relaxed">
          {message.content.split('\n').map((line, i) => {
            if (line.includes('**')) {
              const parts = line.split('**');
              return (
                <div key={i} className={i > 0 ? 'mt-2' : ''}>
                  {parts.map((part, j) => 
                    j % 2 === 1 ? 
                      <span key={j} className="font-semibold">{part}</span> : 
                      <span key={j}>{part}</span>
                  )}
                </div>
              );
            }
            return line ? (
              <div key={i} className={i > 0 ? 'mt-2' : ''}>{line}</div>
            ) : (
              <div key={i} className="h-2" />
            );
          })}
        </div>
        
        <div className={`text-xs mt-2 opacity-60 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;