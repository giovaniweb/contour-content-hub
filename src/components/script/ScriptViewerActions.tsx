
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Calendar, ThumbsUp } from "lucide-react";

interface ScriptViewerActionsProps {
  isPDF: boolean;
  isScheduled: boolean;
  isApproved: boolean;
  onGeneratePDF: () => void;
  onOpenCalendar: () => void;
  onApproveScript: () => void;
  isGeneratingPDF: boolean;
  isApproving: boolean;
}

const ScriptViewerActions: React.FC<ScriptViewerActionsProps> = ({ 
  isPDF,
  isScheduled,
  isApproved,
  onGeneratePDF,
  onOpenCalendar,
  onApproveScript,
  isGeneratingPDF,
  isApproving
}) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={onGeneratePDF}
        disabled={isGeneratingPDF}
      >
        <Download className="h-4 w-4 mr-1" />
        {isPDF ? "Abrir PDF" : "Gerar PDF"}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onOpenCalendar}
        disabled={isScheduled}
      >
        <Calendar className="h-4 w-4 mr-1" />
        {isScheduled ? "Já agendado" : "Agendar"}
      </Button>
      
      {!isApproved && (
        <Button 
          variant="default" 
          size="sm" 
          onClick={onApproveScript}
          disabled={isApproving}
        >
          <ThumbsUp className="h-4 w-4 mr-1" />
          Aprovar
        </Button>
      )}
    </div>
  );
};

export default ScriptViewerActions;
