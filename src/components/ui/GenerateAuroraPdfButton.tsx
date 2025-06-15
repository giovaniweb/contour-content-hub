
import React, { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "./button";
import { toast } from "sonner";

/**
 * Props para o botão de geração de PDF Aurora
 */
interface GenerateAuroraPdfButtonProps {
  sessionId: string;
  diagnosticText: string;
  title: string;
  type?: string;
}

const GenerateAuroraPdfButton: React.FC<GenerateAuroraPdfButtonProps> = ({
  sessionId,
  diagnosticText,
  title,
  type = "marketingDiagnostic",
}) => {
  const [loading, setLoading] = useState(false);

  const handleExportPdf = async () => {
    if (!diagnosticText || diagnosticText.trim().length < 10) {
      toast.error("Conteúdo vazio", {
        description: "Não há um diagnóstico para exportar.",
      });
      return;
    }
    setLoading(true);
    try {
      // Chama a Supabase Edge Function para gerar o PDF
      const response = await fetch(
        `https://mksvzhgqnsjfolvskibq.functions.supabase.co/generate-pdf`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scriptId: sessionId,
            content: diagnosticText,
            title,
            type,
          }),
        }
      );

      const result = await response.json();

      if (result && result.success && result.pdfUrl) {
        window.open(result.pdfUrl, "_blank");
        toast.success("PDF exportado!", {
          description: "O PDF em estilo Aurora foi gerado e está aberto em outra aba.",
        });
      } else if (result && result.error) {
        toast.error("Erro ao gerar PDF", { description: result.error });
      } else {
        toast.error("Falha ao gerar PDF", {
          description: "Não foi possível gerar o PDF.",
        });
      }
    } catch (e) {
      toast.error("Erro ao conectar", { description: "Falha de comunicação com servidor PDF." });
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
