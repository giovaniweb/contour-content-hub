
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

  // Salvar roteiro aprovado
  const { saveScript } = useSaveScript();

  async function handleApproveScript() {
    setIsApproving(true);
    const res = await saveScript({
      content: script.content,
      title: script.title,
      format: script.format,
      equipment_used: script.equipment_used || [],
    });

    setIsApproving(false);

    if (res) {
      toast.success("Roteiro aprovado e salvo na biblioteca!");
      if (onScriptApproved) onScriptApproved(res);
    } else {
      toast.error("Falha ao aprovar roteiro.");
    }
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
        setIsImproving(false);
        return;
      }
      setScriptContent(data.improved);
      toast.success("Roteiro melhorado com sucesso!");
    } catch (e) {
      toast.error("Erro inesperado ao melhorar roteiro.");
    }
    setIsImproving(false);
  }

  function handleNewScript() {
    onNewScript();
  }

  // Gerar imagem
  async function handleGenerateImage() {
    setIsGeneratingImage(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: {
          prompt: script.content,
        },
      });

      if (error || !data?.image) {
        toast.error("Falha ao gerar imagem.");
      } else {
        toast.success("Imagem gerada com sucesso!");
        // Sugestão: Poderia abrir um modal com a imagem se desejado!
        window.open(data.image, "_blank");
      }
    } catch (e) {
      toast.error("Erro inesperado ao gerar imagem.");
    }
    setIsGeneratingImage(false);
  }

  return {
    isApproving,
    isImproving,
    isGeneratingImage,
    handleApproveScript,
    handleImproveScript,
    handleNewScript,
    handleGenerateImage,
  };
}
