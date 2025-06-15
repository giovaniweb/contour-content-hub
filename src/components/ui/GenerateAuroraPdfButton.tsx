import React, { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "./button";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";

/**
 * Novo: Props incluem as três seções para PDF dividido
 */
interface GenerateAuroraPdfButtonProps {
  sessionId: string;
  diagnosticSection: string;
  actionsSection: string;
  contentSection: string;
  title: string;
  type?: string;
}

const GenerateAuroraPdfButton: React.FC<GenerateAuroraPdfButtonProps> = ({
  sessionId,
  diagnosticSection,
  actionsSection,
  contentSection,
  title,
  type = "marketingDiagnostic",
}) => {
  const [loading, setLoading] = useState(false);

  const handleExportPdf = async () => {
    if (
      !diagnosticSection?.trim() ||
      !actionsSection?.trim() ||
      !contentSection?.trim()
    ) {
      toast.error("Conteúdo incompleto", {
        description: "Todas as seções do relatório devem estar preenchidas.",
      });
      return;
    }
    setLoading(true);
    try {
      // Use invoke para adicionar token automaticamente
      // Buscamos URL/token do supabase do ambiente global:
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

      const { data, error } = await supabase.functions.invoke(
        "generate-pdf",
        {
          body: {
            scriptId: sessionId,
            diagnosticSection,
            actionsSection,
            contentSection,
            title,
            type,
          },
        }
      );
      if (error) {
        toast.error("Erro ao gerar PDF", { description: error.message });
        return;
      }
      if (data && data.success && data.pdfUrl) {
        window.open(data.pdfUrl, "_blank");
        toast.success("PDF exportado!", {
          description: "O PDF Aurora Boreal foi gerado e está aberto em outra aba.",
        });
      } else if (data && data.error) {
        toast.error("Erro ao gerar PDF", { description: data.error });
      } else {
        toast.error("Falha ao gerar PDF", {
          description: "Resposta inesperada do servidor.",
        });
      }
    } catch (e: any) {
      toast.error("Erro ao conectar", { description: String(e) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleExportPdf}
      size="sm"
      variant="outline"
      disabled={loading}
      className="flex items-center gap-1 border-purple-500/30 text-purple-400 hover:bg-purple-700/10"
    >
      <FileText className="h-3 w-3" />
      {loading ? "Gerando..." : "Exportar PDF"}
    </Button>
  );
};

export default GenerateAuroraPdfButton;
