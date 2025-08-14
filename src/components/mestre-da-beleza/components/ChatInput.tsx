import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, RotateCcw } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onReset: () => void;
  disabled: boolean;
  aiMode: 'standard' | 'gpt5';
  onModeChange: (mode: 'standard' | 'gpt5') => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onReset,
  disabled,
  aiMode,
  onModeChange
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (!input.trim() || disabled) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            disabled={disabled}
            className="resize-none min-h-[52px] max-h-32 rounded-3xl pr-24 border-2 border-border/50 focus:border-primary/50 bg-background"
            rows={1}
          />
          
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            {/* Mode Toggle */}
            <div className="flex rounded-full border overflow-hidden bg-secondary/50 text-xs">
              <button
                onClick={() => onModeChange('standard')}
                className={`px-2 py-1 transition-all ${
                  aiMode === 'standard' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Padrão
              </button>
              <button
                onClick={() => onModeChange('gpt5')}
                className={`px-2 py-1 transition-all ${
                  aiMode === 'gpt5' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                GPT-5
              </button>
            </div>
          </div>
        </div>
        
        {/* Send Button */}
        <Button
          onClick={handleSubmit}
          disabled={!input.trim() || disabled}
          size="sm"
          className="rounded-full h-12 w-12 p-0 flex-shrink-0"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Reset Button */}
      <div className="flex justify-center mt-3">
        <button
          onClick={onReset}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <RotateCcw className="h-3 w-3" />
          Nova conversa
        </button>
      </div>
    </div>
  );
};

export default ChatInput;