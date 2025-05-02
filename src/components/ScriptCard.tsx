import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, ThumbsUp, Download, Calendar, RefreshCw, CheckCircle } from "lucide-react";
import { ScriptResponse, generatePDF } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import ScriptValidation from "./script-generator/ScriptValidation";
import ScriptEditor from "./script-generator/ScriptEditor";
import ScriptActions from "./script/ScriptActions";
import CalendarDialog from "./script/CalendarDialog";
import AnnotatedText, { TextAnnotation } from "./script/AnnotatedText";
import { mapValidationToAnnotations } from "@/utils/validation/annotations";

interface ScriptCardProps {
  script: ScriptResponse;
  onFeedbackSubmit?: (scriptId: string, feedback: string, approved: boolean) => Promise<void>;
  onReject?: (scriptId: string) => Promise<void>;
  onApprove?: () => Promise<void>;
}

const ScriptCard: React.FC<ScriptCardProps> = ({ 
  script, 
  onFeedbackSubmit, 
  onReject,
  onApprove
}) => {
  const { toast } = useToast();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [editedContent, setEditedContent] = useState(script.content);
  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false);
  const [isScriptApproved, setIsScriptApproved] = useState(false);
  const [textAnnotations, setTextAnnotations] = useState<TextAnnotation[]>([]);

  // Handle script approval
  const handleApproveScript = async () => {
    try {
      setIsApproving(true);
      if (onApprove) {
        await onApprove();
      } else if (onFeedbackSubmit) {
        await onFeedbackSubmit(script.id, "Roteiro aprovado sem alterações", true);
      }
      
      setIsScriptApproved(true);
      toast({
        title: "Roteiro aprovado",
        description: "O roteiro foi aprovado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao aprovar roteiro:", error);
      toast({
        variant: "destructive",
        title: "Erro ao aprovar roteiro",
        description: "Não foi possível aprovar o roteiro",
      });
    } finally {
      setIsApproving(false);
    }
  };

  // Handle PDF generation
  const handleGeneratePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      
      // Check if PDF already exists
      if (script.pdf_url) {
        window.open(script.pdf_url, "_blank");
        return;
      }
      
      toast({
        title: "Gerando PDF",
        description: "Aguarde enquanto geramos o PDF do seu roteiro",
      });
      
      // Chamar a API real para gerar o PDF
      const pdfUrl = await generatePDF(script.id);
      
      if (pdfUrl) {
        toast({
          title: "PDF gerado",
          description: "O PDF do seu roteiro está pronto",
        });
        
        // Abrir o PDF em uma nova aba
        window.open(pdfUrl, "_blank");
      } else {
        throw new Error("Não foi possível gerar o PDF");
      }
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o PDF",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Handle script rejection
  const handleRejectScript = async () => {
    if (!onReject) return;
    
    try {
      await onReject(script.id);
      toast({
        title: "Roteiro rejeitado",
        description: "Uma nova versão será gerada",
      });
    } catch (error) {
      console.error("Erro ao rejeitar roteiro:", error);
      toast({
        variant: "destructive",
        title: "Erro ao rejeitar roteiro",
        description: "Não foi possível rejeitar o roteiro",
      });
    }
  };

  // Handle scheduling
  const handleSchedule = async (date: Date | undefined, timeSlot: string) => {
    if (!date) return;
    
    try {
      // Simulação de agendamento bem-sucedido
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Roteiro agendado",
        description: `O conteúdo foi agendado para ${date.toLocaleDateString('pt-BR')}`,
      });
      
      // Fechar diálogo
      setCalendarDialogOpen(false);
    } catch (error) {
      console.error("Erro ao agendar roteiro:", error);
      toast({
        variant: "destructive",
        title: "Erro ao agendar roteiro",
        description: "Não foi possível agendar o roteiro",
      });
    }
  };

  // Handle validation complete
  const handleValidationComplete = (validation: any) => {
    const newAnnotations = mapValidationToAnnotations(validation);
    setTextAnnotations(newAnnotations);
  };

  // Get the appropriate component for the active tab
  const TypeBadge = () => {
    switch (script.type) {
      case "videoScript":
        return <Badge variant="outline">Roteiro para Vídeo</Badge>;
      case "bigIdea":
        return <Badge variant="outline">Big Idea</Badge>;
      case "dailySales":
        return <Badge variant="outline">Venda Diária</Badge>;
      default:
        return <Badge variant="outline">{script.type}</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
          <div className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2">
              {script.title}
              <TypeBadge />
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Criado em {new Date(script.createdAt).toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="suggestions">Sugestões</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content">
            <div className="space-y-4">
              {isEditingContent ? (
                <ScriptEditor 
                  content={editedContent} 
                  onChange={setEditedContent}
                  readOnly={false}
                />
              ) : (
                <div className="bg-gray-50 p-4 rounded-md text-sm border">
                  {textAnnotations.length > 0 ? (
                    <AnnotatedText 
                      content={editedContent} 
                      annotations={textAnnotations} 
                    />
                  ) : (
                    <div className="whitespace-pre-line">{editedContent}</div>
                  )}
                </div>
              )}
              
              {showValidation && (
                <ScriptValidation 
                  script={{...script, content: editedContent}}
                  onValidationComplete={handleValidationComplete}
                />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="suggestions">
            <div className="space-y-4">
              {script.suggestedVideos && script.suggestedVideos.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Vídeos Sugeridos</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {script.suggestedVideos.map((video, index) => (
                      <div 
                        key={`video-${index}`} 
                        className="border rounded-md p-2 flex items-center gap-2"
                      >
                        {video.thumbnailUrl && (
                          <img 
                            src={video.thumbnailUrl} 
                            alt={video.title} 
                            className="h-12 w-16 rounded object-cover"
                          />
                        )}
                        <div className="truncate">
                          <p className="text-xs font-medium truncate">{video.title}</p>
                          <span className="text-xs text-muted-foreground">{video.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {script.captionTips && script.captionTips.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Dicas de Legendas</h3>
                  <div className="border rounded-md p-3 space-y-2 bg-gray-50">
                    {script.captionTips.map((tip, index) => (
                      <div key={`tip-${index}`} className="flex gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <p className="text-sm">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="pt-2 flex-wrap gap-2">
        <ScriptActions
          script={script}
          isGeneratingPDF={isGeneratingPDF}
          isScriptApproved={isScriptApproved}
          isApproving={isApproving}
          showValidation={showValidation}
          onToggleEditMode={() => setIsEditingContent(!isEditingContent)}
          onGeneratePDF={handleGeneratePDF}
          onToggleValidation={() => setShowValidation(!showValidation)}
          onApproveScript={handleApproveScript}
          onOpenCalendarDialog={() => setCalendarDialogOpen(true)}
          onRejectScript={onReject ? handleRejectScript : undefined}
        />
      </CardFooter>
      
      <CalendarDialog
        open={calendarDialogOpen}
        onOpenChange={setCalendarDialogOpen}
        onSchedule={handleSchedule}
        scriptId={script.id}
      />
    </Card>
  );
};

export default ScriptCard;
