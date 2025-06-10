
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, Clock, Play } from "lucide-react";
import { DiagnosticSession } from '@/hooks/useDiagnosticPersistence';
import { growthWeeks } from '../growth-strategy/strategyData';
import { getPriorityColor } from './utils';

interface GrowthStrategyAccordionProps {
  session: DiagnosticSession;
}

export const GrowthStrategyAccordion: React.FC<GrowthStrategyAccordionProps> = ({ session }) => {
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  const toggleAction = (actionId: string) => {
    const newCompleted = new Set(completedActions);
    if (completedActions.has(actionId)) {
      newCompleted.delete(actionId);
    } else {
      newCompleted.add(actionId);
    }
    setCompletedActions(newCompleted);
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Setup': 'bg-blue-500/20 text-blue-400 border-blue-500/30 backdrop-blur-sm',
      'Conteúdo': 'bg-purple-500/20 text-purple-400 border-purple-500/30 backdrop-blur-sm',
      'Credibilidade': 'bg-green-500/20 text-green-400 border-green-500/30 backdrop-blur-sm',
      'Networking': 'bg-orange-500/20 text-orange-400 border-orange-500/30 backdrop-blur-sm',
      'Resultados': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 backdrop-blur-sm',
      'Testimonials': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 backdrop-blur-sm',
      'Posicionamento': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30 backdrop-blur-sm',
      'Inovação': 'bg-violet-500/20 text-violet-400 border-violet-500/30 backdrop-blur-sm',
      'Promoção': 'bg-pink-500/20 text-pink-400 border-pink-500/30 backdrop-blur-sm',
      'CTA': 'bg-rose-500/20 text-rose-400 border-rose-500/30 backdrop-blur-sm',
      'Automação': 'bg-teal-500/20 text-teal-400 border-teal-500/30 backdrop-blur-sm',
      'Website': 'bg-amber-500/20 text-amber-400 border-amber-500/30 backdrop-blur-sm',
      'Retenção': 'bg-lime-500/20 text-lime-400 border-lime-500/30 backdrop-blur-sm',
      'Partnerships': 'bg-sky-500/20 text-sky-400 border-sky-500/30 backdrop-blur-sm',
      'Otimização': 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30 backdrop-blur-sm',
      'Vendas': 'bg-red-500/20 text-red-400 border-red-500/30 backdrop-blur-sm'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500/20 text-gray-400 border-gray-500/30 backdrop-blur-sm';
  };

  return (
    <div className="space-y-4">
      <Accordion type="multiple" className="space-y-3">
        {growthWeeks.map((week) => (
          <AccordionItem 
            key={week.week} 
            value={`week-${week.week}`} 
            className={`aurora-glass ${week.color} border rounded-lg backdrop-blur-xl hover:shadow-aurora-glow transition-all duration-300`}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline group">
              <div className="flex items-center justify-between w-full mr-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${week.iconColor.replace('text-', 'from-')}/20 to-transparent group-hover:shadow-lg transition-all`}>
                      <week.icon className={`h-5 w-5 ${week.iconColor} group-hover:animate-pulse`} />
                    </div>
                    <span className="font-semibold aurora-text-gradient">Semana {week.week}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground/80">{week.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`${week.iconColor.replace('text-', 'border-')}/30 text-xs backdrop-blur-sm`}>
                    {week.actions.length} ações
                  </Badge>
                  <Badge variant="outline" className="text-xs border-current/30 bg-aurora-electric-purple/10 backdrop-blur-sm">
                    {week.actions.filter(action => 
                      completedActions.has(`week-${week.week}-action-${week.actions.indexOf(action)}`)
                    ).length}/{week.actions.length} concluídas
                  </Badge>
                </div>
              </div>
            </AccordionTrigger>
            
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3">
                {week.actions.map((action, actionIndex) => {
                  const actionId = `week-${week.week}-action-${actionIndex}`;
                  const isCompleted = completedActions.has(actionId);
                  
                  return (
                    <Card 
                      key={actionIndex} 
                      className={`aurora-glass border-white/10 hover:border-aurora-electric-purple/40 transition-all duration-300 group backdrop-blur-xl ${
                        isCompleted ? 'opacity-75 bg-green-500/10 border-green-500/30' : 'hover:shadow-aurora-glow-blue'
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 flex-shrink-0 mt-0.5 hover:bg-aurora-electric-purple/20"
                            onClick={() => toggleAction(actionId)}
                          >
                            <CheckCircle2 
                              className={`h-5 w-5 transition-all duration-300 ${
                                isCompleted 
                                  ? 'text-green-400 fill-green-400/20 animate-pulse' 
                                  : 'text-foreground/40 hover:text-green-400 hover:scale-110'
                              }`} 
                            />
                          </Button>
                          
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium mb-2 leading-relaxed transition-colors ${
                              isCompleted ? 'line-through text-foreground/60' : 'text-foreground group-hover:text-aurora-electric-purple'
                            }`}>
                              {action.action}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getTypeColor(action.type)}`}
                              >
                                {action.type}
                              </Badge>
                              
                              <div className="flex items-center gap-1 text-xs text-foreground/60">
                                <Clock className="h-3 w-3 text-aurora-sage" />
                                <span className="text-aurora-sage">{action.time}</span>
                              </div>
                              
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getPriorityColor(action.priority)} backdrop-blur-sm`}
                              >
                                {action.priority}
                              </Badge>
                            </div>
                          </div>
                          
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className={`h-7 px-3 text-xs flex-shrink-0 transition-all duration-300 ${
                              isCompleted 
                                ? 'bg-green-500/20 border-green-500/30 text-green-400 cursor-not-allowed' 
                                : 'bg-aurora-electric-purple/10 border-aurora-electric-purple/30 hover:bg-aurora-electric-purple/20 hover:shadow-aurora-glow-blue'
                            }`}
                            disabled={isCompleted}
                          >
                            {isCompleted ? (
                              "Concluída ✓"
                            ) : (
                              <>
                                <Play className="h-3 w-3 mr-1" />
                                Iniciar
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Progress Summary */}
      <Card className="aurora-glass border-aurora-lavender/30 backdrop-blur-xl bg-gradient-to-r from-aurora-lavender/10 to-aurora-electric-purple/5 hover:shadow-aurora-glow-intense transition-all duration-300">
        <CardContent className="p-4">
          <div className="text-center">
            <h4 className="font-semibold text-foreground mb-2 aurora-text-gradient">Progresso Geral da Estratégia</h4>
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-400 animate-pulse" />
                <span className="text-aurora-sage">{completedActions.size} ações concluídas</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-foreground/60" />
                <span className="text-aurora-electric-purple">{growthWeeks.reduce((total, week) => total + week.actions.length, 0) - completedActions.size} pendentes</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
