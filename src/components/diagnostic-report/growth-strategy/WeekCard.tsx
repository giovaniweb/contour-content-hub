
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GrowthWeek } from './strategyData';
import { ActionItem } from './ActionItem';

interface WeekCardProps {
  week: GrowthWeek;
}

export const WeekCard: React.FC<WeekCardProps> = ({ week }) => {
  return (
    <Card className={`aurora-glass ${week.color} hover:scale-[1.01] transition-transform`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-foreground">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <week.icon className={`h-5 w-5 ${week.iconColor}`} />
              <span className="text-lg">Semana {week.week}</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-base font-medium">{week.title}</span>
            </div>
          </div>
          <Badge variant="outline" className={`${week.iconColor} text-xs`}>
            {week.actions.length} ações
          </Badge>
        </CardTitle>
        
        {/* Mobile title */}
        <div className="sm:hidden">
          <span className="text-sm font-medium text-foreground/80">{week.title}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 pt-0">
        {week.actions.map((action, actionIndex) => (
          <ActionItem 
            key={actionIndex} 
            action={action} 
            index={actionIndex}
          />
        ))}
      </CardContent>
    </Card>
  );
};
