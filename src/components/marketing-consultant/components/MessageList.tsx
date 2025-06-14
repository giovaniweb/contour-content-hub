
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  role: "user" | "assistant";
  content: string;
}
interface MessageListProps {
  messages: Message[];
  loading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}
const MessageList: React.FC<MessageListProps> = ({ messages, loading, messagesEndRef }) => (
  <>
    {messages.map((message, index) => (
      <div
        key={index}
        className={`flex mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
      >
        {message.role === 'assistant' && (
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src="/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
        )}
        <div
          className={`p-3 rounded-lg max-w-[80%] ${
            message.role === 'user'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted'
          }`}
        >
          {message.content}
        </div>
      </div>
    ))}
    {loading && (
      <div className="flex justify-start mb-4">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src="/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <div className="bg-muted p-3 rounded-lg">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    )}
    <div ref={messagesEndRef} />
  </>
);

export default MessageList;
