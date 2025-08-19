import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Lock, Unlock } from 'lucide-react';

interface LessonStatusBadgeProps {
  isCompleted: boolean;
  isUnlocked: boolean;
  isMandatory: boolean;
}

export const LessonStatusBadge: React.FC<LessonStatusBadgeProps> = ({
  isCompleted,
  isUnlocked,
  isMandatory
}) => {
  if (isCompleted) {
    return (
      <Badge className="bg-green-500 text-white">
        <CheckCircle className="h-3 w-3 mr-1" />
        Concluída
      </Badge>
    );
  }

  if (!isUnlocked) {
    return (
      <Badge variant="outline" className="text-muted-foreground border-muted-foreground">
        <Lock className="h-3 w-3 mr-1" />
        Bloqueada
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="text-blue-500 border-blue-500">
      <Unlock className="h-3 w-3 mr-1" />
      Disponível
    </Badge>
  );
};