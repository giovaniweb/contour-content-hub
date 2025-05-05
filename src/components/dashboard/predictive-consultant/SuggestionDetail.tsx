
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight } from "lucide-react";
import { Suggestion } from './types';

interface SuggestionDetailProps {
  suggestion: Suggestion | null;
  onActionClick: (suggestion: Suggestion) => void;
  getTypeLabel: (type: string) => string;
}

const SuggestionDetail: React.FC<SuggestionDetailProps> = ({
  suggestion,
  onActionClick,
  getTypeLabel
}) => {
  if (!suggestion) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center p-4 text-center">
        <div className="max-w-xs">
          <p className="text-muted-foreground text-sm">
            Selecione uma sugestão para ver os detalhes e ações recomendadas
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Badge className={`
          ${suggestion.type === 'equipment' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
            suggestion.type === 'content' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
            suggestion.type === 'strategy' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
            'bg-purple-100 text-purple-800 hover:bg-purple-200'}
        `}>
          {getTypeLabel(suggestion.type)}
        </Badge>
        <h3 className="font-medium">{suggestion.title}</h3>
      </div>
      
      <div className="flex gap-3 mb-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <div className="bg-muted p-3 rounded-lg text-sm">
          {suggestion.message}
        </div>
      </div>
      
      <Button 
        onClick={() => onActionClick(suggestion)}
        className="w-full"
      >
        {suggestion.actionText}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default SuggestionDetail;
