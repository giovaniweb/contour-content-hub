
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScriptResponse } from "@/types/script";
import { Loader2, ThumbsUp, ThumbsDown, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScriptActionButtonsProps {
  script: ScriptResponse;
  onApprove?: () => Promise<void>;
  onReject?: (id: string) => Promise<void>;
}

const ScriptActionButtons: React.FC<ScriptActionButtonsProps> = ({ 
  script, 
  onApprove, 
  onReject 
}) => {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const { toast } = useToast();

  const handleApprove = async () => {
    if (!onApprove) return;
    
    try {
      setIsApproving(true);
      await onApprove();
      toast({
        title: "Roteiro aprovado",
        description: "O roteiro foi aprovado com sucesso.",
      });
    } catch (error) {
      console.error("Error approving script:", error);
      toast({
        variant: "destructive",
        title: "Erro ao aprovar",
        description: "Não foi possível aprovar o roteiro.",
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!onReject) return;
    
    try {
      setIsRejecting(true);
      await onReject(script.id);
      toast({
        variant: "default",
        title: "Roteiro rejeitado",
        description: "Uma nova versão será gerada em breve.",
      });
    } catch (error) {
      console.error("Error rejecting script:", error);
      toast({
        variant: "destructive",
        title: "Erro ao rejeitar",
        description: "Não foi possível rejeitar o roteiro.",
      });
    } finally {
      setIsRejecting(false);
    }
  };

  const handleDownloadPDF = () => {
    if (script.pdf_url) {
      window.open(script.pdf_url, '_blank');
    } else {
      toast({
        variant: "destructive",
        title: "PDF não disponível",
        description: "O PDF deste roteiro não está disponível no momento.",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      {onReject && (
        <Button variant="outline" onClick={handleReject} disabled={isRejecting || isApproving}>
          {isRejecting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ThumbsDown className="mr-2 h-4 w-4" />
          )}
          Rejeitar
        </Button>
      )}
      
      {script.pdf_url && (
        <Button variant="outline" onClick={handleDownloadPDF}>
          <Download className="mr-2 h-4 w-4" />
          PDF
        </Button>
      )}
      
      {onApprove && (
        <Button onClick={handleApprove} disabled={isApproving || isRejecting}>
          {isApproving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ThumbsUp className="mr-2 h-4 w-4" />
          )}
          Aprovar
        </Button>
      )}
    </div>
  );
};

export default ScriptActionButtons;
