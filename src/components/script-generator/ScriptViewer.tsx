
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ScriptHistoryItem, generatePDF, linkScriptToCalendar, updateScript } from "@/utils/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { createSafeHtml } from '@/utils/security';

import ScriptStatusBadge from "@/components/script/ScriptStatusBadge";
import ScriptMetadata from "@/components/script/ScriptMetadata";
import ScriptViewerActions from "@/components/script/ScriptViewerActions";
import DateSelector from "@/components/script/DateSelector";
import ScriptValidationScores from "@/components/script/ScriptValidationScores";

interface ScriptViewerProps {
  script: ScriptHistoryItem;
  onRefresh?: () => void;
}

const ScriptViewer: React.FC<ScriptViewerProps> = ({ script, onRefresh }) => {
  const { toast } = useToast();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [schedulingDialogOpen, setSchedulingDialogOpen] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  // Generate mock validation scores for demonstration
  // In a real implementation, these should come from the API
  const validationScores = {
    hookScore: 7.8,
    clarityScore: 8.2,
    ctaScore: 6.9,
    emotionalScore: 7.5,
    totalScore: 7.6
  };

  const improvementSuggestions = [
    "Fortaleça o gancho inicial com uma estatística ou pergunta que desperte curiosidade.",
    "Adicione mais detalhes sobre os resultados específicos que o cliente pode esperar.",
    "Inclua um chamado à ação mais claro e urgente no final do roteiro."
  ];

  const handleGeneratePDF = async () => {
    if (script.pdf_url) {
      // Se o PDF já existe, abrir em nova aba
      window.open(script.pdf_url, "_blank");
      return;
    }

    try {
      setIsGeneratingPDF(true);
      const pdfUrl = await generatePDF(script.id);
      
      if (pdfUrl) {
        toast({
          title: "PDF gerado com sucesso",
          description: "O PDF do seu roteiro está pronto",
        });
        
        // Atualizar o script para refletir a URL do PDF
        if (onRefresh) onRefresh();
        
        // Abrir PDF em nova aba
        window.open(pdfUrl, "_blank");
      } else {
        throw new Error("Não foi possível gerar o PDF");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o PDF neste momento",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSchedule = async () => {
    if (!selectedDate) {
      toast({
        variant: "destructive",
        title: "Selecione uma data",
        description: "Por favor, selecione uma data para agendar o roteiro",
      });
      return;
    }

    try {
      setIsScheduling(true);
      
      // Criar um evento na agenda
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      
      // Aqui precisaríamos criar o evento na agenda e depois vincular ao roteiro
      // Por simplicidade, vamos apenas simular o vínculo
      
      // Na implementação real, você criaria o evento primeiro e depois obteria o ID
      const eventId = "simulado-" + Math.random().toString(36).substring(2, 9);
      
      // Vincular roteiro ao evento
      const success = await linkScriptToCalendar(script.id, eventId);
      
      if (success) {
        toast({
          title: "Roteiro agendado",
          description: `Seu roteiro foi agendado para ${format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`,
        });
        
        setSchedulingDialogOpen(false);
        
        // Atualizar o script para refletir o vínculo com a agenda
        if (onRefresh) onRefresh();
      } else {
        throw new Error("Não foi possível agendar o roteiro");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao agendar",
        description: "Não foi possível agendar o roteiro neste momento",
      });
    } finally {
      setIsScheduling(false);
    }
  };

  // Aprovar roteiro
  const handleApproveScript = async () => {
    try {
      setIsApproving(true);
      
      // Atualizar o status do roteiro para aprovado
      await updateScript(script.id, script.content, "Roteiro aprovado", "aprovado");
      
      toast({
        title: "Roteiro aprovado",
        description: "O roteiro foi aprovado com sucesso",
      });
      
      // Atualizar a visualização
      if (onRefresh) onRefresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao aprovar roteiro",
        description: "Não foi possível aprovar o roteiro neste momento",
      });
    } finally {
      setIsApproving(false);
    }
  };

  // Funções auxiliares para formatação
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
  };

  const isScheduled = !!script.evento_agenda_id;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          <div>
            <CardTitle className="text-xl mb-1">{script.title}</CardTitle>
            <div className="flex items-center flex-wrap gap-2 mt-1">
              <ScriptStatusBadge 
                status={script.status} 
                isPDF={!!script.pdf_url} 
                isScheduled={isScheduled} 
              />
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground mt-2 md:mt-0">
            Criado em {formatDate(script.createdAt)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="prose max-w-none mb-6">
          <div dangerouslySetInnerHTML={createSafeHtml(script.contentHtml)} />
        </div>

        <ScriptMetadata 
          type={script.type}
          marketingObjective={script.marketingObjective}
          observation={script.observation}
        />

        {showValidation && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-medium mb-4">Validação do Roteiro</h3>
            <ScriptValidationScores 
              scores={validationScores}
              suggestions={improvementSuggestions}
            />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex flex-wrap gap-2 justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowValidation(!showValidation)}
        >
          {showValidation ? "Ocultar Validação" : "Mostrar Validação"}
        </Button>

        <ScriptViewerActions 
          isPDF={!!script.pdf_url}
          isScheduled={isScheduled}
          isApproved={script.status === 'aprovado'}
          onGeneratePDF={handleGeneratePDF}
          onOpenCalendar={() => setSchedulingDialogOpen(true)}
          onApproveScript={handleApproveScript}
          isGeneratingPDF={isGeneratingPDF}
          isApproving={isApproving}
        />
      </CardFooter>
      
      <Dialog open={schedulingDialogOpen} onOpenChange={setSchedulingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agendar Roteiro</DialogTitle>
            <DialogDescription>
              Selecione uma data para programar este roteiro na sua agenda criativa
            </DialogDescription>
          </DialogHeader>
          
          <DateSelector 
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSchedulingDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSchedule}
              disabled={isScheduling || !selectedDate}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ScriptViewer;
