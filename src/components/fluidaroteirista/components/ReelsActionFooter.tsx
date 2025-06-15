
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Sparkles, RefreshCw, CheckCircle, Headphones } from "lucide-react";

interface ReelsActionFooterProps {
  onApproveScript?: () => void;
  onImproveScript?: () => void;
  onNewScript?: () => void;
  onGenerateAudio?: () => void;
  isGeneratingAudio?: boolean;
}

const ReelsActionFooter: React.FC<ReelsActionFooterProps> = ({
  onApproveScript,
  onImproveScript,
  onNewScript,
  onGenerateAudio,
  isGeneratingAudio = false,
}) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mt-8 w-full animate-fade-in">
      <Button
        onClick={onApproveScript}
        variant="gradient"
        className="flex items-center gap-2"
      >
        <CheckCircle className="h-4 w-4" />
        Aprovar roteiro
      </Button>
      <Button
        onClick={onImproveScript}
        variant="secondary"
        className="flex items-center gap-2"
      >
        <Sparkles className="h-4 w-4" />
        Melhorar roteiro
      </Button>
      <Button
        onClick={onNewScript}
        variant="outline"
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Novo roteiro
      </Button>
      <Button
        onClick={onGenerateAudio}
        variant="glass"
        className="flex items-center gap-2"
        disabled={isGeneratingAudio}
      >
        <Headphones className="h-4 w-4" />
        {isGeneratingAudio ? "Gerando áudio..." : "Gerar áudio"}
      </Button>
    </div>
  );
};
export default ReelsActionFooter;
