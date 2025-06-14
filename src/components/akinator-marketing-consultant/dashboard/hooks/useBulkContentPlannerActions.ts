
import { useContentPlanner } from "@/hooks/useContentPlanner";
import { useState } from "react";
import { toast } from "sonner";

// Tipos parciais comuns conforme outras sugestões
type BasicItem = {
  title: string;
  description: string;
  status?: string;
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
      const created = await addItem({ ...item, aiGenerated: true });
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
