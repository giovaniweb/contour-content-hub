
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, Clock, Play, Plus, Trello, Pause, Square, Timer } from "lucide-react";
import { DiagnosticSession } from '@/hooks/useDiagnosticPersistence';
import { growthWeeks } from '../growth-strategy/strategyData';
import { getPriorityColor } from './utils';
import { useDiagnosticToPlanner } from '@/hooks/useDiagnosticToPlanner';
import { useGrowthStrategyProgress } from '@/hooks/useGrowthStrategyProgress';
import { Progress } from "@/components/ui/progress";

interface GrowthStrategyAccordionProps {
  session: DiagnosticSession;
}

export const GrowthStrategyAccordion: React.FC<GrowthStrategyAccordionProps> = ({ session }) => {
  const { addActionToPlanner, addMultipleActionsToPlanner, isAdding } = useDiagnosticToPlanner(session);
  
  const {
    startAction,
    pauseAction,
    completeAction,
    getActionStatus,
    getActionTime,
    formatTime,
    getWeekProgress,
    getOverallProgress,
    activeActionId
  } = useGrowthStrategyProgress();

  const getTypeColor = (type: string) => {
    const colors = {
      'Setup': 'bg-blue-500/20 text-blue-200 border-blue-400/30 backdrop-blur-sm',
      'Conteúdo': 'bg-purple-500/20 text-purple-200 border-purple-400/30 backdrop-blur-sm',
      'Credibilidade': 'bg-green-500/20 text-green-200 border-green-400/30 backdrop-blur-sm',
      'Networking': 'bg-orange-500/20 text-orange-200 border-orange-400/30 backdrop-blur-sm',
      'Resultados': 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30 backdrop-blur-sm',
      'Testimonials': 'bg-cyan-500/20 text-cyan-200 border-cyan-400/30 backdrop-blur-sm',
      'Posicionamento': 'bg-indigo-500/20 text-indigo-200 border-indigo-400/30 backdrop-blur-sm',
      'Inovação': 'bg-violet-500/20 text-violet-200 border-violet-400/30 backdrop-blur-sm',
      'Promoção': 'bg-pink-500/20 text-pink-200 border-pink-400/30 backdrop-blur-sm',
      'CTA': 'bg-rose-500/20 text-rose-200 border-rose-400/30 backdrop-blur-sm',
      'Automação': 'bg-teal-500/20 text-teal-200 border-teal-400/30 backdrop-blur-sm',
      'Website': 'bg-amber-500/20 text-amber-200 border-amber-400/30 backdrop-blur-sm',
      'Retenção': 'bg-lime-500/20 text-lime-200 border-lime-400/30 backdrop-blur-sm',
      'Partnerships': 'bg-sky-500/20 text-sky-200 border-sky-400/30 backdrop-blur-sm',
      'Otimização': 'bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-400/30 backdrop-blur-sm',
      'Vendas': 'bg-red-500/20 text-red-200 border-red-400/30 backdrop-blur-sm'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500/20 text-gray-200 border-gray-400/30 backdrop-blur-sm';
  };

  const handleAddWeekToPlanner = async (week: typeof growthWeeks[0]) => {
    const weekActions = week.actions.map(action => ({
      title: `Semana ${week.week}: ${action.action}`,
      description: action.action,
      priority: action.priority,
      time: action.time,
      category: action.type,
      type: action.type
    }));
    
    await addMultipleActionsToPlanner(weekActions);
  };

  const handleAddActionToPlanner = async (action: typeof growthWeeks[0]['actions'][0], weekNumber: number) => {
    const actionData = {
      title: `Semana ${weekNumber}: ${action.action}`,
      description: action.action,
      priority: action.priority,
      time: action.time,
      category: action.type,
      type: action.type
    };
    
    await addActionToPlanner(actionData);
  };

  const handleActionClick = (action: typeof growthWeeks[0]['actions'][0], weekNumber: number, actionIndex: number) => {
    const actionId = `week-${weekNumber}-action-${actionIndex}`;
    const status = getActionStatus(actionId);
    
    if (status === 'not_started' || status === 'paused') {
      startAction(actionId, action.action);
    } else if (status === 'in_progress') {
      pauseAction(actionId);
    }
  };

  const handleCompleteAction = (action: typeof growthWeeks[0]['actions'][0], weekNumber: number, actionIndex: number) => {
    const actionId = `week-${weekNumber}-action-${actionIndex}`;
    completeAction(actionId, action.action);
  };

  const overallProgress = getOverallProgress(growthWeeks);

  return (
    <div className="space-y-6">
      {/* Progresso Geral Melhorado */}
      <Card className="aurora-glass border-aurora-lavender/30 backdrop-blur-xl bg-gradient-to-r from-aurora-lavender/10 to-aurora-electric-purple/5 hover:shadow-aurora-glow-intense transition-all duration-300">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="font-semibold text-white mb-2 aurora-text-gradient text-lg">
                Progresso Geral da Estratégia
              </h4>
              <div className="text-3xl font-bold text-aurora-electric-purple mb-2">
                {overallProgress.progressPercentage}%
              </div>
            </div>
            
            <Progress 
              value={overallProgress.progressPercentage} 
              className="h-3 bg-white/10"
            />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-green-400">
                  {overallProgress.completedActions}
                </div>
                <div className="text-xs text-white/80">Concluídas</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-aurora-electric-purple">
                  {overallProgress.totalActions - overallProgress.completedActions}
                </div>
                <div className="text-xs text-white/80">Pendentes</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-aurora-sage">
                  {overallProgress.formattedTime}
                </div>
                <div className="text-xs text-white/80">Tempo Total</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-aurora-lavender">
                  {growthWeeks.length}
                </div>
                <div className="text-xs text-white/80">Semanas</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Accordion type="multiple" className="space-y-3">
        {growthWeeks.map((week) => {
          const weekProgress = getWeekProgress(week.week, week.actions);
          const weekPercentage = week.actions.length > 0 
            ? Math.round((weekProgress.completedActions / week.actions.length) * 100) 
            : 0;

          return (
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
                      <span className="font-semibold text-white">Semana {week.week}</span>
                    </div>
                    <span className="text-sm font-medium text-white/90">{week.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right text-xs text-white/80">
                      <div className="font-semibold text-aurora-electric-purple">{weekPercentage}%</div>
                      <div>{weekProgress.completedActions}/{week.actions.length}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddWeekToPlanner(week);
                      }}
                      disabled={isAdding}
                      className="text-xs bg-aurora-glass border-aurora-electric-purple/30 hover:bg-aurora-electric-purple/20 hover:shadow-aurora-glow-blue transition-all duration-300 text-white"
                    >
                      <Trello className="h-3 w-3 mr-1" />
                      Semana
                    </Button>
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-3">
                  {week.actions.map((action, actionIndex) => {
                    const actionId = `week-${week.week}-action-${actionIndex}`;
                    const status = getActionStatus(actionId);
                    const actionTime = getActionTime(actionId);
                    const isActive = activeActionId === actionId;
                    
                    return (
                      <Card 
                        key={actionIndex} 
                        className={`aurora-glass border-white/10 hover:border-aurora-electric-purple/40 transition-all duration-300 group backdrop-blur-xl ${
                          status === 'completed' ? 'opacity-75 bg-green-500/10 border-green-500/30' : 
                          status === 'in_progress' ? 'bg-aurora-electric-purple/10 border-aurora-electric-purple/40 shadow-aurora-glow-blue' :
                          'hover:shadow-aurora-glow-blue'
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 flex-shrink-0 mt-0.5 hover:bg-aurora-electric-purple/20"
                              onClick={() => handleCompleteAction(action, week.week, actionIndex)}
                            >
                              <CheckCircle2 
                                className={`h-5 w-5 transition-all duration-300 ${
                                  status === 'completed'
                                    ? 'text-green-400 fill-green-400/20 animate-pulse' 
                                    : 'text-white/40 hover:text-green-400 hover:scale-110'
                                }`} 
                              />
                            </Button>
                            
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium mb-2 leading-relaxed transition-colors ${
                                status === 'completed' ? 'line-through text-white/60' : 'text-white group-hover:text-aurora-electric-purple'
                              }`}>
                                {action.action}
                              </p>
                              
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${getTypeColor(action.type)}`}
                                >
                                  {action.type}
                                </Badge>
                                
                                <div className="flex items-center gap-1 text-xs text-white/70">
                                  <Clock className="h-3 w-3 text-aurora-sage" />
                                  <span className="text-aurora-sage">{action.time}</span>
                                </div>
                                
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${getPriorityColor(action.priority)} backdrop-blur-sm`}
                                >
                                  {action.priority}
                                </Badge>

                                {actionTime > 0 && (
                                  <Badge variant="outline" className="text-xs border-aurora-lavender/30 text-aurora-lavender bg-aurora-lavender/10">
                                    <Timer className="h-3 w-3 mr-1" />
                                    {formatTime(actionTime)}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAddActionToPlanner(action, week.week)}
                                disabled={isAdding}
                                className="h-7 px-3 text-xs flex-shrink-0 bg-aurora-glass border-aurora-electric-purple/30 hover:bg-aurora-electric-purple/20 hover:shadow-aurora-glow-blue transition-all duration-300 text-white"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Planejador
                              </Button>
                              
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleActionClick(action, week.week, actionIndex)}
                                className={`h-7 px-3 text-xs flex-shrink-0 transition-all duration-300 ${
                                  status === 'completed'
                                    ? 'bg-green-500/20 border-green-500/30 text-green-400 cursor-not-allowed' 
                                    : status === 'in_progress'
                                    ? 'bg-aurora-electric-purple/20 border-aurora-electric-purple/30 text-aurora-electric-purple shadow-aurora-glow-blue'
                                    : status === 'paused'
                                    ? 'bg-orange-500/20 border-orange-500/30 text-orange-400'
                                    : 'bg-aurora-electric-purple/10 border-aurora-electric-purple/30 hover:bg-aurora-electric-purple/20 hover:shadow-aurora-glow-blue text-white'
                                }`}
                                disabled={status === 'completed'}
                              >
                                {status === 'completed' ? (
                                  "Concluída ✓"
                                ) : status === 'in_progress' ? (
                                  <>
                                    <Pause className="h-3 w-3 mr-1" />
                                    {isActive ? "Pausar" : "Em Progresso"}
                                  </>
                                ) : status === 'paused' ? (
                                  <>
                                    <Play className="h-3 w-3 mr-1" />
                                    Retomar
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-3 w-3 mr-1" />
                                    Iniciar
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};
