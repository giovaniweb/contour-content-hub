
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, ThumbsUp, FileText, Sparkles, Check, Calendar, RefreshCw } from "lucide-react";
import { ScriptResponse } from '@/utils/api';

interface ScriptActionsProps {
  script: ScriptResponse;
  isGeneratingPDF: boolean;
  isScriptApproved: boolean;
  isApproving: boolean;
  showValidation: boolean;
  onOpenFeedbackDialog: () => void;
  onGeneratePDF: () => void;
  onToggleValidation: () => void;
  onApproveScript: () => void;
  onOpenCalendarDialog: () => void;
  onRejectScript?: () => void;
}

const ScriptActions: React.FC<ScriptActionsProps> = ({
  script,
  isGeneratingPDF,
  isScriptApproved,
  isApproving,
  showValidation,
  onOpenFeedbackDialog,
  onGeneratePDF,
  onToggleValidation,
  onApproveScript,
  onOpenCalendarDialog,
  onRejectScript
}) => {
  return (
    <div className="flex gap-2 flex-wrap">
      <Button 
        variant="outline" 
        size="sm"
        onClick={onGeneratePDF}
        disabled={isGeneratingPDF}
      >
        <Download className="h-4 w-4 mr-1" />
        Guia CapCut
      </Button>
      
      <Button 
        variant="default" 
        size="sm"
        onClick={onOpenFeedbackDialog}
      >
        <FileText className="h-4 w-4 mr-1" />
        Feedback
      </Button>

      <Button
        variant={showValidation ? "secondary" : "outline"}
        size="sm"
        onClick={onToggleValidation}
      >
        <Sparkles className="h-4 w-4 mr-1" />
        {showValidation ? "Ocultar Validação" : "Validar com IA"}
      </Button>

      <Button
        variant="secondary"
        size="sm"
        onClick={onApproveScript}
        disabled={isApproving || isScriptApproved}
        className="bg-green-600 hover:bg-green-700"
      >
        <Check className="h-4 w-4 mr-1" />
        {isScriptApproved ? "Roteiro Aprovado" : "Aprovar Roteiro"}
      </Button>

      {onRejectScript && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRejectScript}
          disabled={isApproving || isScriptApproved}
          className="bg-red-600 hover:bg-red-700"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refazer
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={onOpenCalendarDialog}
        className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
      >
        <Calendar className="h-4 w-4 mr-1" />
        Agendar
      </Button>
    </div>
  );
};

export default ScriptActions;
