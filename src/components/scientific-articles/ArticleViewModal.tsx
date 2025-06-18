
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download, MessageSquare } from "lucide-react";

interface ArticleViewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  pdfUrl?: string;
  documentId?: string;
}

const ArticleViewModal: React.FC<ArticleViewModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  pdfUrl,
  documentId
}) => {
  const handleDownload = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  const handleOpenInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] aurora-glass border-aurora-electric-purple/30">
        <DialogHeader>
          <DialogTitle className="aurora-heading text-xl">
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4">
          {/* Action buttons */}
          <div className="flex items-center gap-3 pb-4 border-b border-aurora-electric-purple/20">
            <Button
              onClick={handleOpenInNewTab}
              className="aurora-button flex items-center gap-2"
              size="sm"
            >
              <ExternalLink className="h-4 w-4" />
              Abrir em Nova Aba
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="aurora-glass border-aurora-electric-purple/30 text-aurora-electric-purple hover:bg-aurora-electric-purple/20 flex items-center gap-2"
              size="sm"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button
              variant="outline"
              className="aurora-glass border-aurora-neon-blue/30 text-aurora-neon-blue hover:bg-aurora-neon-blue/20 flex items-center gap-2"
              size="sm"
            >
              <MessageSquare className="h-4 w-4" />
              Fazer Pergunta
            </Button>
          </div>
          
          {/* PDF Viewer */}
          {pdfUrl ? (
            <div className="flex-1 min-h-[600px] rounded-lg overflow-hidden aurora-glass">
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                className="w-full h-[600px] rounded-lg"
                title={title}
              />
            </div>
          ) : (
            <div className="flex-1 min-h-[600px] flex items-center justify-center aurora-glass rounded-lg">
              <p className="text-slate-400">PDF não disponível para visualização</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleViewModal;
