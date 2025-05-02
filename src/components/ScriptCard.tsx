import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ScriptResponse, saveScriptFeedback, generatePDF, updateScript } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';
import ScriptValidation from "./script-generator/ScriptValidation";
import { getValidation } from '@/utils/ai-validation';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CalendarDialog } from "./script-generator/CalendarDialog";
import ScriptHeader from "./script/ScriptHeader";
import FeedbackDialog from "./script/FeedbackDialog";
import ScriptActions from "./script/ScriptActions";

interface ScriptCardProps {
  script: ScriptResponse;
  onFeedbackSubmit?: (scriptId: string, feedback: string, approved: boolean) => Promise<void> | void;
  onApprove?: (scriptId: string) => Promise<void> | void;
  onReject?: (scriptId: string) => Promise<void> | void;
}

const ScriptCard: React.FC<ScriptCardProps> = ({ script, onFeedbackSubmit, onApprove, onReject }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [validationScore, setValidationScore] = useState<number | null>(null);
  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false);
  const [isScriptApproved, setIsScriptApproved] = useState(false);
  const { toast } = useToast();

  // Check if script has validation on mount
  useEffect(() => {
    const checkValidation = async () => {
      try {
        const validation = await getValidation(script.id);
        if (validation) {
          setValidationScore(validation.total);
        }
      } catch (error) {
        console.error("Erro ao verificar validação:", error);
      }
    };
    
    checkValidation();
  }, [script.id]);

  const handleSubmitFeedback = async (feedbackText: string, isApproved: boolean) => {
    try {
      setIsSubmitting(true);
      await saveScriptFeedback(script.id, feedbackText, isApproved);
      toast({
        title: isApproved ? "Roteiro aprovado!" : "Feedback enviado",
        description: "Obrigado pelo seu feedback.",
      });
      setDialogOpen(false);
      if (onFeedbackSubmit) onFeedbackSubmit(script.id, feedbackText, isApproved);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Falha no envio",
        description: "Não foi possível enviar seu feedback.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveScript = async () => {
    try {
      setIsApproving(true);
      await updateScript(script.id, script.content, "Roteiro aprovado", "aprovado");
      
      toast({
        title: "Roteiro aprovado!",
        description: "O roteiro foi marcado como aprovado.",
      });
      
      // Update local state
      setIsScriptApproved(true);
      
      if (onApprove) await onApprove(script.id);
      
      // Abre o diálogo de calendário automaticamente após a aprovação
      setCalendarDialogOpen(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Falha na aprovação",
        description: "Não foi possível aprovar o roteiro.",
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectScript = async () => {
    try {
      setIsApproving(true);
      
      // Add a generic feedback for rejection
      await updateScript(script.id, script.content, "Roteiro precisa ser refeito", "gerado");
      
      toast({
        title: "Roteiro rejeitado",
        description: "O roteiro foi marcado para ser refeito.",
      });
      
      if (onReject) await onReject(script.id);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Falha na rejeição",
        description: "Não foi possível marcar o roteiro para ser refeito.",
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      const pdfUrl = await generatePDF(script.id);
      if (pdfUrl) {
        window.open(pdfUrl, "_blank");
        toast({
          title: "PDF Gerado",
          description: "Seu roteiro em PDF está pronto para download.",
        });
      } else {
        throw new Error("Não foi possível gerar o PDF");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Falha na geração",
        description: "Não foi possível gerar o PDF.",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleValidationComplete = (validation: any) => {
    if (validation && validation.total) {
      setValidationScore(validation.total);
    }
  };

  const handleCalendarScheduleSuccess = (date: Date, eventId: string) => {
    toast({
      title: "Roteiro agendado",
      description: `O roteiro foi adicionado ao calendário para ${date.toLocaleDateString('pt-BR')}`,
    });
    setCalendarDialogOpen(false);
  };

  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <TooltipProvider>
      <Card className="w-full reelline-card">
        <CardHeader className="pb-2">
          <ScriptHeader 
            script={script}
            validationScore={validationScore}
            isScriptApproved={isScriptApproved}
            formatDate={formatDate}
          />
        </CardHeader>
        <CardContent className="pb-2">
          <div className="bg-gray-50 p-4 rounded-md text-sm whitespace-pre-line">
            {script.content}
          </div>
          
          {script.suggestedVideos && script.suggestedVideos.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Vídeos Sugeridos</h4>
              <div className="horizontal-scroll">
                {script.suggestedVideos.map((video) => (
                  <div 
                    key={video.id}
                    className="w-48 p-2 border rounded-md bg-white"
                  >
                    <div className="aspect-video bg-gray-200 rounded-sm overflow-hidden mb-2">
                      <img 
                        src={video.thumbnailUrl} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs font-medium truncate">{video.title}</p>
                    <p className="text-xs text-muted-foreground">{video.duration}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-wrap gap-2 justify-between pt-2">
          <ScriptActions
            script={script}
            isGeneratingPDF={isGeneratingPDF}
            isScriptApproved={isScriptApproved}
            isApproving={isApproving}
            showValidation={showValidation}
            onOpenFeedbackDialog={() => setDialogOpen(true)}
            onGeneratePDF={handleGeneratePDF}
            onToggleValidation={() => setShowValidation(!showValidation)}
            onApproveScript={handleApproveScript}
            onOpenCalendarDialog={() => setCalendarDialogOpen(true)}
            onRejectScript={onReject ? handleRejectScript : undefined}
          />
        </CardFooter>
      </Card>
      
      {showValidation && (
        <ScriptValidation 
          script={script} 
          onValidationComplete={handleValidationComplete}
        />
      )}

      <FeedbackDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmitFeedback={handleSubmitFeedback}
        isSubmitting={isSubmitting}
      />

      <CalendarDialog 
        open={calendarDialogOpen}
        onOpenChange={setCalendarDialogOpen}
        scriptId={script.id}
        scriptTitle={script.title}
        scriptType={script.type}
        onSuccess={handleCalendarScheduleSuccess}
      />
    </TooltipProvider>
  );
};

export default ScriptCard;
