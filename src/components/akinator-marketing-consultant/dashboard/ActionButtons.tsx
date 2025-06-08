
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw, Download, Share2 } from "lucide-react";

interface ActionButtonsProps {
  onRestart: () => void;
  onDownload: () => void;
  onShare: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onRestart,
  onDownload,
  onShare
}) => {
  return (
    <Card className="aurora-card border-aurora-electric-purple/30">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={onDownload}
            className="aurora-button flex items-center gap-2 w-full sm:w-auto"
          >
            <Download className="h-4 w-4" />
            Baixar Relatório PDF
          </Button>
          
          <Button
            onClick={onShare}
            variant="outline"
            className="aurora-glass border-aurora-sage/30 text-aurora-sage hover:bg-aurora-sage/10 flex items-center gap-2 w-full sm:w-auto"
          >
            <Share2 className="h-4 w-4" />
            Compartilhar Diagnóstico
          </Button>
          
          <Button
            onClick={onRestart}
            variant="outline"
            className="aurora-glass border-aurora-electric-purple/30 text-aurora-electric-purple hover:bg-aurora-electric-purple/10 flex items-center gap-2 w-full sm:w-auto"
          >
            <RotateCcw className="h-4 w-4" />
            Novo Diagnóstico
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionButtons;
