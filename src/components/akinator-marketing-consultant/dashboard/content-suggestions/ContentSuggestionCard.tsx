
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { Plus } from "lucide-react";
import { ContentSuggestion } from './types';
import { getFormatIcon, getFormatColor, getDifficultyColor } from './formatUtils';

interface ContentSuggestionCardProps {
  suggestion: ContentSuggestion;
  index: number;
  onAddToPlanner: (suggestion: ContentSuggestion) => void;
}

const ContentSuggestionCard: React.FC<ContentSuggestionCardProps> = ({
  suggestion,
  index,
  onAddToPlanner
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="aurora-card h-full hover:shadow-lg transition-all duration-300 group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between mb-2">
            <div className={`p-2 rounded-lg ${getFormatColor(suggestion.format)}`}>
              {getFormatIcon(suggestion.format)}
            </div>
            <div className="flex gap-1">
              <Badge variant="outline" className={getDifficultyColor(suggestion.difficulty)}>
                {suggestion.difficulty}
              </Badge>
            </div>
          </div>
          <CardTitle className="text-sm font-semibold aurora-heading line-clamp-2">
            {suggestion.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-xs aurora-body opacity-80 line-clamp-3">
            {suggestion.description}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="aurora-body opacity-70">Objetivo:</span>
              <Badge variant="outline" className="text-xs">
                {suggestion.objective}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="aurora-body opacity-70">Tempo:</span>
              <span className="aurora-body">{suggestion.estimatedTime}</span>
            </div>
            
            {suggestion.equipment && (
              <div className="flex items-center justify-between text-xs">
                <span className="aurora-body opacity-70">Equipamento:</span>
                <Badge variant="outline" className="text-xs bg-aurora-sage/20 text-aurora-sage border-aurora-sage/30">
                  {suggestion.equipment}
                </Badge>
              </div>
            )}
          </div>
          
          <Button
            onClick={() => onAddToPlanner(suggestion)}
            className="w-full aurora-button text-xs h-8 group-hover:scale-105 transition-transform"
            size="sm"
          >
            <Plus className="h-3 w-3 mr-1" />
            Adicionar ao Planejador
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContentSuggestionCard;
