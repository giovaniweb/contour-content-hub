
import React from "react";
import { FileText } from "lucide-react";
import { Button } from "./button";
import { toast } from "sonner";
import { downloadPdf, openPdfInNewTab, isPdfUrlValid } from "@/utils/pdfUtils";

export interface ReportPdfButtonProps {
  pdfUrl?: string;
  diagnosticTitle?: string;
}

const ReportPdfButton: React.FC<ReportPdfButtonProps> = ({ pdfUrl, diagnosticTitle }) => {
  const handleOpenPdf = async () => {
    if (!pdfUrl || !isPdfUrlValid(pdfUrl)) {
      toast.error("PDF não disponível", {
        description: "Este diagnóstico não possui relatório em PDF exportado ainda."
      });
      return;
    }

    // Abre em nova aba e também permite baixar PDF
    try {
      openPdfInNewTab(pdfUrl);
      toast.success("PDF aberto", {
        description: diagnosticTitle || "Relatório em PDF"
      });
    } catch (e) {
      toast.error("Erro ao abrir PDF", {
        description: "O PDF não pôde ser aberto."
      });
    }
  };

  return (
    <Button onClick={handleOpenPdf} size="sm" variant="outline" className="flex items-center gap-1 border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
      <FileText className="h-3 w-3" />
      PDF
    </Button>
  );
};

export default ReportPdfButton;
