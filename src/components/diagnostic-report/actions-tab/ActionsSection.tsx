
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionCard } from './ActionCard';

interface ActionItem {
  title: string;
  description: string;
  priority: string;
  time: string;
  category: string;
}

interface ActionsSectionProps {
  title: string;
  icon: React.ReactNode;
  badge: React.ReactNode;
  actions: ActionItem[];
  getPriorityColor: (priority: string) => string;
  className?: string;
}

export const ActionsSection: React.FC<ActionsSectionProps> = ({
  title,
  icon,
  badge,
  actions,
  getPriorityColor,
  className
}) => {
  return (
    <Card className={`aurora-card ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          {icon}
          {title}
          {badge}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {actions.map((action, index) => (
          <ActionCard
            key={index}
            action={action}
            getPriorityColor={getPriorityColor}
          />
        ))}
      </CardContent>
    </Card>
  );
};
