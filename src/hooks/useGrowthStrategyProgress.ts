
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface ActionProgress {
  actionId: string;
  status: 'not_started' | 'in_progress' | 'paused' | 'completed';
  startTime?: number;
  endTime?: number;
  totalTime: number;
  sessionTimes: { start: number; end?: number }[];
}

export interface WeekProgress {
  weekNumber: number;
  totalActions: number;
  completedActions: number;
  inProgressActions: number;
  totalTimeSpent: number;
}

export const useGrowthStrategyProgress = () => {
  const [actionProgress, setActionProgress] = useState<Record<string, ActionProgress>>({});
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  // Carregar progresso do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('growth_strategy_progress');
    if (saved) {
      try {
        setActionProgress(JSON.parse(saved));
      } catch (error) {
        console.error('Erro ao carregar progresso:', error);
      }
    }
  }, []);

  // Salvar progresso no localStorage
  useEffect(() => {
    localStorage.setItem('growth_strategy_progress', JSON.stringify(actionProgress));
  }, [actionProgress]);

  const startAction = (actionId: string, actionTitle: string) => {
    const now = Date.now();
    
    // Pausar ação ativa se houver
    if (activeActionId && activeActionId !== actionId) {
      pauseAction(activeActionId);
    }

    setActionProgress(prev => ({
      ...prev,
      [actionId]: {
        ...prev[actionId],
        actionId,
        status: 'in_progress',
        startTime: prev[actionId]?.startTime || now,
        sessionTimes: [
          ...(prev[actionId]?.sessionTimes || []),
          { start: now }
        ],
        totalTime: prev[actionId]?.totalTime || 0
      }
    }));

    setActiveActionId(actionId);
    setSessionStartTime(now);

    toast.success("⏰ Ação iniciada!", {
      description: `Começando: "${actionTitle}"`,
      action: {
        label: "Pausar",
        onClick: () => pauseAction(actionId)
      }
    });
  };

  const pauseAction = (actionId: string) => {
    const now = Date.now();
    
    setActionProgress(prev => {
      const current = prev[actionId];
      if (!current || current.status !== 'in_progress') return prev;

      const lastSession = current.sessionTimes[current.sessionTimes.length - 1];
      if (lastSession && !lastSession.end) {
        lastSession.end = now;
        const sessionDuration = now - lastSession.start;
        
        return {
          ...prev,
          [actionId]: {
            ...current,
            status: 'paused',
            totalTime: current.totalTime + sessionDuration,
            sessionTimes: [...current.sessionTimes.slice(0, -1), lastSession]
          }
        };
      }
      
      return prev;
    });

    setActiveActionId(null);
    setSessionStartTime(null);

    toast.info("⏸️ Ação pausada", {
      description: "Você pode retomar a qualquer momento"
    });
  };

  const completeAction = (actionId: string, actionTitle: string) => {
    const now = Date.now();
    
    setActionProgress(prev => {
      const current = prev[actionId];
      let totalTime = current?.totalTime || 0;

      // Se estava em progresso, calcular tempo da sessão atual
      if (current?.status === 'in_progress') {
        const lastSession = current.sessionTimes[current.sessionTimes.length - 1];
        if (lastSession && !lastSession.end) {
          totalTime += now - lastSession.start;
        }
      }

      return {
        ...prev,
        [actionId]: {
          ...current,
          actionId,
          status: 'completed',
          endTime: now,
          totalTime,
          sessionTimes: current?.sessionTimes.map(session => 
            !session.end && session === current.sessionTimes[current.sessionTimes.length - 1]
              ? { ...session, end: now }
              : session
          ) || []
        }
      };
    });

    setActiveActionId(null);
    setSessionStartTime(null);

    toast.success("🎉 Ação concluída!", {
      description: `"${actionTitle}" foi finalizada com sucesso!`,
    });
  };

  const getActionStatus = (actionId: string): ActionProgress['status'] => {
    return actionProgress[actionId]?.status || 'not_started';
  };

  const getActionTime = (actionId: string): number => {
    const progress = actionProgress[actionId];
    if (!progress) return 0;

    let time = progress.totalTime;
    
    // Se está em progresso, adicionar tempo da sessão atual
    if (progress.status === 'in_progress' && sessionStartTime) {
      time += Date.now() - sessionStartTime;
    }

    return time;
  };

  const formatTime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getWeekProgress = (weekNumber: number, weekActions: any[]): WeekProgress => {
    const totalActions = weekActions.length;
    let completedActions = 0;
    let inProgressActions = 0;
    let totalTimeSpent = 0;

    weekActions.forEach((_, index) => {
      const actionId = `week-${weekNumber}-action-${index}`;
      const status = getActionStatus(actionId);
      const time = getActionTime(actionId);

      if (status === 'completed') completedActions++;
      if (status === 'in_progress') inProgressActions++;
      totalTimeSpent += time;
    });

    return {
      weekNumber,
      totalActions,
      completedActions,
      inProgressActions,
      totalTimeSpent
    };
  };

  const getOverallProgress = (allWeeks: any[]) => {
    const totalActions = allWeeks.reduce((sum, week) => sum + week.actions.length, 0);
    let completedActions = 0;
    let totalTimeSpent = 0;

    allWeeks.forEach(week => {
      const weekProgress = getWeekProgress(week.week, week.actions);
      completedActions += weekProgress.completedActions;
      totalTimeSpent += weekProgress.totalTimeSpent;
    });

    return {
      totalActions,
      completedActions,
      progressPercentage: totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0,
      totalTimeSpent,
      formattedTime: formatTime(totalTimeSpent)
    };
  };

  return {
    actionProgress,
    activeActionId,
    startAction,
    pauseAction,
    completeAction,
    getActionStatus,
    getActionTime,
    formatTime,
    getWeekProgress,
    getOverallProgress
  };
};
