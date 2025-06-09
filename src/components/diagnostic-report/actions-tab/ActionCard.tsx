
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from "lucide-react";

interface ActionItem {
  title: string;
  description: string;
  priority: string;
  time: string;
  category: string;
}

interface ActionCardProps {
  action: ActionItem;
  getPriorityColor: (priority: string) => string;
}

export const ActionCard: React.FC<ActionCardProps> = ({ action, getPriorityColor }) => {
  return (
    <Card className="aurora-glass border-white/10">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium text-foreground">{action.title}</h4>
              <Badge variant="outline" className={getPriorityColor(action.priority)}>
                {action.priority}
              </Badge>
            </div>
            <p className="text-sm text-foreground/70 mb-3">{action.description}</p>
            <div className="flex items-center gap-4 text-xs text-foreground/60">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {action.time}
              </div>
              <Badge variant="secondary" className="text-xs">
                {action.category}
              </Badge>
            </div>
          </div>
          <Button size="sm" variant="outline" className="shrink-0 ml-4">
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
