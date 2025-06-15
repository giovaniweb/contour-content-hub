
import { useContentPlanner } from "@/hooks/useContentPlanner";
import { useState } from "react";
import { toast } from "sonner";
import { ContentPlannerStatus } from "@/types/content-planner";

// Tipos parciais comuns conforme outras sugestões
type BasicItem = {
  title: string;
  description: string;
  status?: import('@/types/content-planner').ContentPlannerStatus;
  tags?: string[];
  format?: import('@/types/content-planner').ContentFormat;
  objective?: string;
  distribution?: import('@/types/content-planner').ContentDistribution;
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
      const created = await addItem({
        ...item,
        status: (item.status ?? 'idea') as import('@/types/content-planner').ContentPlannerStatus,
        format: (item.format ?? 'carrossel') as import('@/types/content-planner').ContentFormat,
        distribution: (item.distribution ?? 'Instagram') as import('@/types/content-planner').ContentDistribution,
        aiGenerated: true,
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
