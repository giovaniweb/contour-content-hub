
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface ActionProgress {
  actionId: string;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface WeekProgress {
  weekNumber: number;
  totalActions: number;
  completedActions: number;
  inProgressActions: number;
}

export const useGrowthStrategyProgress = () => {
  const [actionProgress, setActionProgress] = useState<Record<string, ActionProgress>>({});

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
    setActionProgress(prev => ({
      ...prev,
      [actionId]: {
        actionId,
        status: 'in_progress'
      }
    }));

    toast.success("✅ Ação iniciada!", {
      description: `Começando: "${actionTitle}"`,
      action: {
        label: "Marcar como concluída",
        onClick: () => completeAction(actionId, actionTitle)
      }
    });
  };

  const completeAction = (actionId: string, actionTitle: string) => {
    setActionProgress(prev => ({
      ...prev,
      [actionId]: {
        actionId,
        status: 'completed'
      }
    }));

    toast.success("🎉 Ação concluída!", {
      description: `"${actionTitle}" foi finalizada com sucesso!`,
    });
  };

  const resetAction = (actionId: string, actionTitle: string) => {
    setActionProgress(prev => ({
      ...prev,
      [actionId]: {
        actionId,
        status: 'not_started'
      }
    }));

    toast.info("🔄 Ação resetada", {
      description: `"${actionTitle}" foi marcada como não iniciada`
    });
  };

  const getActionStatus = (actionId: string): ActionProgress['status'] => {
    return actionProgress[actionId]?.status || 'not_started';
  };

  const getWeekProgress = (weekNumber: number, weekActions: any[]): WeekProgress => {
    const totalActions = weekActions.length;
    let completedActions = 0;
    let inProgressActions = 0;

    weekActions.forEach((_, index) => {
      const actionId = `week-${weekNumber}-action-${index}`;
      const status = getActionStatus(actionId);

      if (status === 'completed') completedActions++;
      if (status === 'in_progress') inProgressActions++;
    });

    return {
      weekNumber,
      totalActions,
      completedActions,
      inProgressActions
    };
  };

  const getOverallProgress = (allWeeks: any[]) => {
    const totalActions = allWeeks.reduce((sum, week) => sum + week.actions.length, 0);
    let completedActions = 0;
    let inProgressActions = 0;

    allWeeks.forEach(week => {
      const weekProgress = getWeekProgress(week.week, week.actions);
      completedActions += weekProgress.completedActions;
      inProgressActions += weekProgress.inProgressActions;
    });

    return {
      totalActions,
      completedActions,
      inProgressActions,
      pendingActions: totalActions - completedActions - inProgressActions,
      progressPercentage: totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0
    };
  };

  return {
    actionProgress,
    startAction,
    completeAction,
    resetAction,
    getActionStatus,
    getWeekProgress,
    getOverallProgress
  };
};
