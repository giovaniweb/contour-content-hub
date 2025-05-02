
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Sparkles, Calendar, CheckCircle, X, Pencil } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScriptResponse } from "@/utils/api";

interface ScriptActionsProps {
  script: ScriptResponse;
  isGeneratingPDF: boolean;
  isScriptApproved: boolean;
  isApproving: boolean;
  showValidation: boolean;
  onGeneratePDF: () => void;
  onToggleValidation: () => void;
  onApproveScript: () => void;
  onOpenCalendarDialog: () => void;
  onRejectScript?: () => void;
  onToggleEditMode?: () => void;
}

const ScriptActions: React.FC<ScriptActionsProps> = ({
  script,
  isGeneratingPDF,
  isScriptApproved,
  isApproving,
  showValidation,
  onGeneratePDF,
  onToggleValidation,
  onApproveScript,
  onOpenCalendarDialog,
  onRejectScript,
  onToggleEditMode,
}) => {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-2 w-full">
        <div className="flex gap-2 mr-auto">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onGeneratePDF}
            disabled={isGeneratingPDF}
          >
            <Download className="h-4 w-4 mr-2" />
            {isGeneratingPDF ? "Gerando PDF..." : "Baixar PDF"}
          </Button>
          
          <Button
            variant={showValidation ? "secondary" : "outline"}
            size="sm"
            onClick={onToggleValidation}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {showValidation ? "Ocultar Validação" : "Validar com IA"}
          </Button>
          
          {onToggleEditMode && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToggleEditMode}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar Texto
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar o conteúdo do roteiro</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        
        <div className="flex gap-2">
          {onRejectScript && !isScriptApproved && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onRejectScript}
                  className="text-gray-500 hover:text-red-600"
                >
                  <X className="h-4 w-4 mr-2" />
                  Rejeitar
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Rejeitar este roteiro e gerar um novo</p>
              </TooltipContent>
            </Tooltip>
          )}
          
          {!isScriptApproved && (
            <Button 
              variant="default" 
              size="sm"
              onClick={onApproveScript}
              disabled={isApproving}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isApproving ? "Processando..." : "Aprovar"}
            </Button>
          )}
          
          {isScriptApproved && (
            <Button 
              variant="default" 
              size="sm"
              onClick={onOpenCalendarDialog}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Agendar
            </Button>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ScriptActions;
