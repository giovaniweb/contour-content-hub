
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock } from "lucide-react";
import { ActionItem as ActionItemType } from './strategyData';
import { getPriorityColor } from '../actions-tab/utils';

interface ActionItemProps {
  action: ActionItemType;
  index: number;
}

const getTypeColor = (type: string) => {
  const colors = {
    'Setup': 'bg-blue-500/20 text-blue-400',
    'Conteúdo': 'bg-purple-500/20 text-purple-400',
    'Credibilidade': 'bg-green-500/20 text-green-400',
    'Networking': 'bg-orange-500/20 text-orange-400',
    'Resultados': 'bg-emerald-500/20 text-emerald-400',
    'Testimonials': 'bg-cyan-500/20 text-cyan-400',
    'Posicionamento': 'bg-indigo-500/20 text-indigo-400',
    'Inovação': 'bg-violet-500/20 text-violet-400',
    'Promoção': 'bg-pink-500/20 text-pink-400',
    'CTA': 'bg-rose-500/20 text-rose-400',
    'Automação': 'bg-teal-500/20 text-teal-400',
    'Website': 'bg-amber-500/20 text-amber-400',
    'Retenção': 'bg-lime-500/20 text-lime-400',
    'Partnerships': 'bg-sky-500/20 text-sky-400',
    'Otimização': 'bg-fuchsia-500/20 text-fuchsia-400',
    'Vendas': 'bg-red-500/20 text-red-400'
  };
  return colors[type as keyof typeof colors] || 'bg-gray-500/20 text-gray-400';
};

export const ActionItem: React.FC<ActionItemProps> = ({ action, index }) => {
  return (
    <Card className="aurora-glass border-white/10 hover:border-white/20 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-foreground/40 hover:text-green-400 cursor-pointer transition-colors mt-0.5 flex-shrink-0" />
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground mb-2 leading-relaxed">
              {action.action}
            </p>
            
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className={`text-xs ${getTypeColor(action.type)}`}>
                {action.type}
              </Badge>
              
              <div className="flex items-center gap-1 text-xs text-foreground/60">
                <Clock className="h-3 w-3" />
                {action.time}
              </div>
              
              <Badge variant="outline" className={`text-xs ${getPriorityColor(action.priority)}`}>
                {action.priority}
              </Badge>
            </div>
          </div>
          
          <Button size="sm" variant="ghost" className="h-7 px-3 text-xs flex-shrink-0">
            Iniciar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
