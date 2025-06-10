
import { useState } from 'react';
import { toast } from 'sonner';
import { useContentPlanner } from '@/hooks/useContentPlanner';
import { DiagnosticSession } from '@/hooks/useDiagnosticPersistence';
import { DiagnosticAction, convertActionToContentItem, convertMultipleActionsToContentItems } from '@/utils/diagnosticToPlanner';

export const useDiagnosticToPlanner = (session: DiagnosticSession) => {
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useContentPlanner();

  const addActionToPlanner = async (action: DiagnosticAction): Promise<boolean> => {
    try {
      setIsAdding(true);
      
      const contentItem = convertActionToContentItem(action, session);
      const createdItem = await addItem(contentItem);
      
      if (createdItem) {
        toast.success("🎯 Ação adicionada ao planejador!", {
          description: `"${action.title}" foi adicionada como uma nova ideia.`,
          action: {
            label: "Ver Planejador",
            onClick: () => window.open('/content-planner', '_blank')
          }
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao adicionar ação ao planejador:', error);
      toast.error("❌ Erro ao adicionar ao planejador", {
        description: "Não foi possível adicionar a ação. Tente novamente."
      });
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  const addMultipleActionsToPlanner = async (actions: DiagnosticAction[]): Promise<boolean> => {
    try {
      setIsAdding(true);
      
      const contentItems = convertMultipleActionsToContentItems(actions, session);
      let successCount = 0;
      
      for (const item of contentItems) {
        const createdItem = await addItem(item);
        if (createdItem) {
          successCount++;
        }
      }
      
      if (successCount > 0) {
        toast.success(`🚀 ${successCount} ações adicionadas ao planejador!`, {
          description: `Plano estratégico criado com base na consultoria de marketing.`,
          action: {
            label: "Ver Planejador",
            onClick: () => window.open('/content-planner', '_blank')
          }
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao adicionar múltiplas ações:', error);
      toast.error("❌ Erro ao criar plano no planejador", {
        description: "Não foi possível criar o plano. Tente novamente."
      });
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  return {
    addActionToPlanner,
    addMultipleActionsToPlanner,
    isAdding
  };
};
