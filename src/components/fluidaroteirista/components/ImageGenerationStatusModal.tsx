
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, X, Image as ImageIcon, AlertTriangle } from "lucide-react";

export interface ImageGenerationStatusModalProps {
  open: boolean;
  status: { step: string; imageUrl?: string; error?: string } | null;
  onClose: () => void;
}
const ImageGenerationStatusModal: React.FC<ImageGenerationStatusModalProps> = ({ open, status, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md aurora-glass border border-aurora-electric-purple/40 text-center">
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center text-aurora-electric-purple text-lg justify-center">
            <ImageIcon className="h-6 w-6" />
            Geração de Imagem
          </DialogTitle>
        </DialogHeader>
        <div className="p-2">
          {status?.step === "pending" && (
            <div className="flex flex-col items-center gap-4 py-4">
              <Loader2 className="h-12 w-12 animate-spin text-aurora-electric-purple mx-auto" />
              <span className="text-white">Gerando imagem com IA...</span>
            </div>
          )}
          {status?.step === "success" && status.imageUrl && (
            <div className="flex flex-col items-center gap-3">
              <img 
                src={status.imageUrl} 
                alt="Imagem gerada" 
                className="rounded-lg max-w-xs max-h-60 border border-aurora-electric-purple/20 mx-auto"
              />
              <a href={status.imageUrl} target="_blank" rel="noopener noreferrer" className="mt-2 text-aurora-neon-blue underline">
                Abrir imagem em nova aba
              </a>
              <Button 
                onClick={onClose}
                className="mt-3"
                variant="outline"
              >
                Fechar
              </Button>
            </div>
          )}
          {status?.step === "fail" && (
            <div className="flex flex-col items-center gap-4 py-4">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <span className="text-yellow-100">{status.error || "Erro ao gerar imagem"}</span>
              <Button 
                onClick={onClose}
                variant="outline"
                className="mt-2"
              >
                Fechar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default ImageGenerationStatusModal;
