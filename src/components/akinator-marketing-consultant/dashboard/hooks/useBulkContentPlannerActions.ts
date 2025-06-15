
import { useContentPlanner } from "@/hooks/useContentPlanner";
import { useState } from "react";
import { toast } from "sonner";
import { ContentPlannerStatus } from "@/types/content-planner";

// Tipos parciais comuns conforme outras sugestões
type BasicItem = {
  title: string;
  description: string;
  status?: ContentPlannerStatus; // Corrigir explicitamente o tipo
  tags?: string[];
  format?: string;
  objective?: string;
  distribution?: string;
  aiGenerated?: boolean;
};

interface UseBulkPlannerActionsReturn {
  loading: boolean;
  sendAllToPlanner: (
    items: BasicItem[]
  ) => Promise<number>;
}

export function useBulkContentPlannerActions(): UseBulkPlannerActionsReturn {
  const { addItem } = useContentPlanner();
  const [loading, setLoading] = useState(false);

  const sendAllToPlanner = async (items: BasicItem[]) => {
    setLoading(true);
    let successCount = 0;
    for (const item of items) {
      // Garanta que status seja válido, se não definido default para "idea"
      const created = await addItem({
        ...item,
        status: 'idea' as ContentPlannerStatus,
        aiGenerated: true
      });
      if (created) successCount++;
    }
    setLoading(false);
    toast.success("Planejamento enviado!", {
      description: `${successCount} itens adicionados ao Content Planner!`,
      action: {
        label: "Ver Planejador",
        onClick: () => window.open("/content-planner", "_blank"),
      },
    });
    return successCount;
  };

  return { loading, sendAllToPlanner };
}
