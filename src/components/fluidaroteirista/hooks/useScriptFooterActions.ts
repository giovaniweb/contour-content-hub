
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSaveScript } from "./useSaveScript";

/**
 * Hook centralizado para ações do rodapé de geração de roteiro.
 * Uso: const actions = useScriptFooterActions({ script, onNewScript });
 */
export function useScriptFooterActions({
  script,
  onScriptApproved,
  onNewScript,
}: {
  script: {
    content: string;
    title: string;
    format: string;
    equipment_used?: string[];
  };
  onScriptApproved?: (data: any) => void;
  onNewScript: () => void;
}) {
  const [isApproving, setIsApproving] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageStatus, setImageStatus] = useState<null | { step: string; imageUrl?: string; error?: string }> (null);

  // Salvar roteiro aprovado
  const { saveScript } = useSaveScript();

  async function handleApproveScript() {
    setIsApproving(true);
    try {
      const res = await saveScript({
        content: script.content,
        title: script.title,
        format: script.format,
        equipment_used: script.equipment_used || [],
      });
      if (res) {
        toast.success("Roteiro aprovado e salvo na biblioteca!");
        if (onScriptApproved) onScriptApproved(res);
      } else {
        toast.error("Falha ao aprovar roteiro.");
      }
    } catch {
      toast.error("Erro inesperado ao aprovar roteiro.");
    }
    setIsApproving(false);
  }

  // Melhorar roteiro usando edge function Supabase
  async function handleImproveScript(setScriptContent: (s: string) => void) {
    setIsImproving(true);
    try {
      const { data, error } = await supabase.functions.invoke("improve-script", {
        body: {
          content: script.content,
        },
      });

      if (error || !data?.improved) {
        toast.error("Falha ao melhorar roteiro.");
      } else {
        setScriptContent(data.improved);
        toast.success("Roteiro melhorado com sucesso!");
      }
    } catch {
      toast.error("Erro inesperado ao melhorar roteiro.");
    }
    setIsImproving(false);
  }

  function handleNewScript() {
    onNewScript();
  }

  // Gerar imagem com modal de status
  async function handleGenerateImage() {
    setIsGeneratingImage(true);
    setImageStatus({ step: "pending" });
    try {
      setImageStatus({ step: "pending" });
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: {
          prompt: script.content,
        },
      });

      if (error || !data?.image) {
        setImageStatus({ step: "fail", error: "Falha ao gerar imagem." });
        toast.error("Falha ao gerar imagem.");
      } else {
        setImageStatus({ step: "success", imageUrl: data.image });
        toast.success("Imagem gerada com sucesso!");
      }
    } catch {
      setImageStatus({ step: "fail", error: "Erro inesperado ao gerar imagem." });
      toast.error("Erro inesperado ao gerar imagem.");
    }
    setIsGeneratingImage(false);
  }

  function closeImageStatus() {
    setImageStatus(null);
  }

  return {
    isApproving,
    isImproving,
    isGeneratingImage,
    handleApproveScript,
    handleImproveScript,
    handleNewScript,
    handleGenerateImage,
    imageStatus,
    closeImageStatus,
  };
}
