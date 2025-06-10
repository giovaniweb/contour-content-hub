
import { useState } from 'react';
import { toast } from 'sonner';
import { DiagnosticSession } from './useDiagnosticPersistence';
import { convertActionToContentItem, convertMultipleActionsToContentItems, DiagnosticAction } from '@/utils/diagnosticToPlanner';
import { createContentPlannerItem } from '@/services/content-planner';

export const useDiagnosticToPlanner = (session: DiagnosticSession) => {
  const [isAdding, setIsAdding] = useState(false);

  const addActionToPlanner = async (action: DiagnosticAction) => {
    try {
      setIsAdding(true);
      
      // Converter ação do diagnóstico para item do planejador
      const contentItem = convertActionToContentItem(action, session);
      
      // Criar item no banco de dados via serviço real
      const createdItem = await createContentPlannerItem(contentItem);
      
      if (createdItem) {
        toast.success("✅ Ação adicionada ao planejador!", {
          description: `"${action.title}" foi adicionada com sucesso`,
          action: {
            label: "Ver Planejador",
            onClick: () => window.open('/content-planner', '_blank')
          }
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar ação ao planejador:', error);
      toast.error("❌ Erro ao adicionar", {
        description: "Não foi possível adicionar a ação ao planejador"
      });
    } finally {
      setIsAdding(false);
    }
  };

  const addMultipleActionsToPlanner = async (actions: DiagnosticAction[]) => {
    try {
      setIsAdding(true);
      
      // Converter todas as ações
      const contentItems = convertMultipleActionsToContentItems(actions, session);
      
      // Criar itens no banco de dados via serviço real
      let successCount = 0;
      for (const item of contentItems) {
        const createdItem = await createContentPlannerItem(item);
        if (createdItem) {
          successCount++;
        }
      }
      
      if (successCount > 0) {
        toast.success(`✅ ${successCount} ações adicionadas!`, {
          description: `${successCount} de ${actions.length} ações foram adicionadas ao planejador`,
          action: {
            label: "Ver Planejador",
            onClick: () => window.open('/content-planner', '_blank')
          }
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar ações ao planejador:', error);
      toast.error("❌ Erro ao adicionar", {
        description: "Não foi possível adicionar as ações ao planejador"
      });
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
