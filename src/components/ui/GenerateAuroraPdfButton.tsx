import React, { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "./button";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";
import html2canvas from "html2canvas";

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

const SUPABASE_URL = "https://mksvzhgqnsjfolvskibq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rc3Z6aGdxbnNqZm9sdnNraWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMjg3NTgsImV4cCI6MjA2MTcwNDc1OH0.ERpPooxjvC4BthjXKus6s1xqE7FAE_cjZbEciS_VD4Q";

const GenerateAuroraPdfButton: React.FC<GenerateAuroraPdfButtonProps> = ({
  sessionId,
  diagnosticSection,
  actionsSection,
  contentSection,
  title,
  type = "marketingDiagnostic",
}) => {
  const [loading, setLoading] = useState(false);

  // Novo fluxo: extrai HTML como string!
  const handleExportPdf = async () => {
    setLoading(true);
    try {
      const reportElement = document.getElementById("diagnostic-report-html-capture");
      if (!reportElement) {
        toast.error("Seção do relatório não encontrada para exportação", {
          description: "Verifique se está visualizando o relatório completo.",
        });
        setLoading(false);
        return;
      }

      // Extrai o HTML da div como string
      const htmlString = reportElement.outerHTML;

      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

      const { data, error } = await supabase.functions.invoke(
        "generate-pdf",
        {
          body: {
            sessionId,
            title,
            htmlString,
            type
          },
        }
      );
      if (error) {
        let detailedMsg = error.message || "Erro desconhecido ao gerar PDF";
        try {
          if (error?.context) {
            detailedMsg += ` (${error.context})`;
          }
          if (error.body) {
            const errorJson = JSON.parse(error.body);
            if (errorJson.error) detailedMsg = errorJson.error + (errorJson.details ? `: ${errorJson.details}` : "");
          } else if (error.response && typeof error.response.text === "function") {
            const bodyText = await error.response.text();
            if (bodyText) {
              try {
                const json = JSON.parse(bodyText);
                if (json.error) {
                  detailedMsg = json.error + (json.details ? `: ${json.details}` : "");
                } else {
                  detailedMsg = JSON.stringify(json);
                }
              } catch {
                detailedMsg = bodyText;
              }
            }
          }
        } catch (e) {}
        toast.error("Erro ao gerar PDF", { description: detailedMsg });
        setLoading(false);
        return;
      }
      if (data && data.success && data.pdfUrl) {
        window.open(data.pdfUrl, "_blank");
        toast.success("PDF exportado!", {
          description: "O PDF foi gerado e está aberto em outra aba.",
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
