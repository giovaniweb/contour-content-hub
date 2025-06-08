
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Image, Download, History } from "lucide-react";

interface ActionButtonsProps {
  onCreateScript: () => void;
  onGenerateImage: () => void;
  onDownloadPDF: () => void;
  onViewHistory?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCreateScript,
  onGenerateImage,
  onDownloadPDF,
  onViewHistory
}) => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-foreground">
        ✅ Próximos Passos
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button 
          onClick={onCreateScript}
          className="h-auto p-6 flex flex-col items-center gap-3 aurora-gradient-bg hover:opacity-90 text-white"
        >
          <FileText className="h-6 w-6" />
          <div className="text-center">
            <div className="font-semibold">Criar Roteiro</div>
            <div className="text-xs opacity-90">Baseado neste diagnóstico</div>
          </div>
        </Button>

        <Button 
          onClick={onGenerateImage}
          className="h-auto p-6 flex flex-col items-center gap-3 bg-gradient-to-r from-aurora-neon-blue to-aurora-cyan hover:opacity-90 text-white"
        >
          <Image className="h-6 w-6" />
          <div className="text-center">
            <div className="font-semibold">Gerar Imagem</div>
            <div className="text-xs opacity-90">Com base nas ideias</div>
          </div>
        </Button>

        <Button 
          onClick={onDownloadPDF}
          className="h-auto p-6 flex flex-col items-center gap-3 bg-gradient-to-r from-aurora-electric-purple to-primary hover:opacity-90 text-white"
        >
          <Download className="h-6 w-6" />
          <div className="text-center">
            <div className="font-semibold">Baixar PDF</div>
            <div className="text-xs opacity-90">Estratégia completa</div>
          </div>
        </Button>

        {onViewHistory && (
          <Button 
            onClick={onViewHistory}
            variant="outline"
            className="h-auto p-6 flex flex-col items-center gap-3 border-2 hover:bg-aurora-electric-purple/10 border-aurora-electric-purple/50 text-foreground"
          >
            <History className="h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold">Histórico</div>
              <div className="text-xs opacity-70">Relatórios anteriores</div>
            </div>
          </Button>
        )}
      </div>
    </section>
  );
};

export default ActionButtons;
