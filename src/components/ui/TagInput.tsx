
import React, { useState, KeyboardEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  maxTags?: number;
  disabled?: boolean;
}

export const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  ({ value, onChange, placeholder = "Adicionar tag...", className, maxTags = 10, disabled = false }, ref) => {
    const [inputValue, setInputValue] = useState<string>('');
    
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && inputValue.trim()) {
        e.preventDefault();
        
        if (value.length >= maxTags) {
          return;
        }
        
        // Verificar se a tag já existe
        if (!value.includes(inputValue.trim())) {
          const newTags = [...value, inputValue.trim()];
          onChange(newTags);
        }
        
        setInputValue('');
      }
    };
    
    const removeTag = (tagToRemove: string) => {
      const newTags = value.filter(tag => tag !== tagToRemove);
      onChange(newTags);
    };
    
    return (
      <div className={cn("w-full", className)}>
        <div className="flex flex-wrap gap-2 p-2 bg-background border rounded-md min-h-10">
          {value.map((tag) => (
            <Badge key={tag} variant="secondary" className="h-6 px-2 text-sm gap-1">
              {tag}
              <button 
                type="button" 
                onClick={() => removeTag(tag)}
                className="ml-1 rounded-full hover:bg-destructive/20 focus:outline-none focus:ring-1 focus:ring-destructive"
                disabled={disabled}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remover tag {tag}</span>
              </button>
            </Badge>
          ))}
          <Input
            ref={ref}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[120px] h-6 p-0 text-sm border-0 focus-visible:ring-0"
            disabled={disabled || value.length >= maxTags}
          />
        </div>
        {value.length >= maxTags && (
          <p className="text-xs text-muted-foreground mt-1">
            Número máximo de tags atingido ({maxTags})
          </p>
        )}
      </div>
    );
  }
);

TagInput.displayName = "TagInput";

export default TagInput;
