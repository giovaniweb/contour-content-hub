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
    <div className="border-t bg-background/95 backdrop-blur-sm p-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            disabled={disabled}
            className="pr-32 resize-none min-h-[52px] max-h-32"
            rows={1}
          />
          
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Mode Toggle */}
            <div className="flex rounded-lg border overflow-hidden bg-secondary/50">
              <button
                onClick={() => onModeChange('standard')}
                className={`px-3 py-1 text-xs transition-all ${
                  aiMode === 'standard' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Padrão
              </button>
              <button
                onClick={() => onModeChange('gpt5')}
                className={`px-3 py-1 text-xs transition-all ${
                  aiMode === 'gpt5' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                GPT-5
              </button>
            </div>
            
            {/* Send Button */}
            <Button
              onClick={handleSubmit}
              disabled={!input.trim() || disabled}
              size="sm"
              className="rounded-full h-8 w-8 p-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
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
    </div>
  );
};

export default ChatInput;