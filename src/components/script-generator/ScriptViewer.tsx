
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, FileText, ThumbsUp, Clock } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { ScriptHistoryItem, generatePDF, linkScriptToCalendar, updateScript } from "@/utils/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'videoScript':
        return "Roteiro para Vídeo";
      case 'bigIdea':
        return "Campanha Criativa";
      case 'dailySales':
        return "Vendas Diárias";
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'gerado':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600">Gerado</Badge>;
      case 'aprovado':
        return <Badge variant="outline" className="bg-green-50 text-green-600">Aprovado</Badge>;
      case 'editado':
        return <Badge variant="outline" className="bg-amber-50 text-amber-600">Editado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const isScheduled = !!script.evento_agenda_id;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          <div>
            <CardTitle className="text-xl mb-1">{script.title}</CardTitle>
            <div className="flex items-center flex-wrap gap-2 mt-1">
              <Badge variant="secondary">{getTypeLabel(script.type)}</Badge>
              {getStatusBadge(script.status)}
              {isScheduled && (
                <Badge variant="outline" className="bg-purple-50 text-purple-600">
                  <Calendar className="h-3 w-3 mr-1" />
                  Agendado
                </Badge>
              )}
              {script.pdf_url && (
                <Badge variant="outline" className="bg-red-50 text-red-600">
                  <FileText className="h-3 w-3 mr-1" />
                  PDF
                </Badge>
              )}
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground mt-2 md:mt-0">
            Criado em {formatDate(script.createdAt)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="prose max-w-none mb-6">
          <div dangerouslySetInnerHTML={{ __html: script.contentHtml }} />
        </div>

        {script.marketingObjective && (
          <div className="bg-blue-50 p-3 rounded-md mb-4">
            <h4 className="font-medium text-sm text-blue-800 mb-1">Objetivo de marketing</h4>
            <p className="text-sm text-blue-600">
              {script.marketingObjective === "atrair_atencao" ? "Atrair atenção" :
               script.marketingObjective === "criar_conexao" ? "Criar conexão" :
               script.marketingObjective === "fazer_comprar" ? "Incentivar compra" :
               script.marketingObjective === "reativar_interesse" ? "Reativar interesse" :
               script.marketingObjective === "fechar_agora" ? "Fechar agora" :
               script.marketingObjective}
            </p>
          </div>
        )}

        {script.observation && (
          <div className="bg-amber-50 p-3 rounded-md">
            <h4 className="font-medium text-sm text-amber-800 mb-1">Observações</h4>
            <p className="text-sm text-amber-600">{script.observation}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex flex-wrap gap-2 justify-between">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleGeneratePDF}
            disabled={isGeneratingPDF}
          >
            <Download className="h-4 w-4 mr-1" />
            {script.pdf_url ? "Abrir PDF" : "Gerar PDF"}
          </Button>
          
          <Dialog open={schedulingDialogOpen} onOpenChange={setSchedulingDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={isScheduled}>
                <Calendar className="h-4 w-4 mr-1" />
                {isScheduled ? "Já agendado" : "Agendar"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agendar Roteiro</DialogTitle>
                <DialogDescription>
                  Selecione uma data para programar este roteiro na sua agenda criativa
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <div className="flex justify-center mb-6">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border pointer-events-auto"
                    locale={ptBR}
                    initialFocus
                  />
                </div>
                
                {selectedDate && (
                  <div className="bg-muted/30 p-3 rounded-md text-center">
                    <Clock className="h-5 w-5 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">
                      O roteiro será agendado para<br />
                      {format(selectedDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                )}
              </div>
              
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
          
          {script.status !== 'aprovado' && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleApproveScript}
              disabled={isApproving}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              Aprovar
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ScriptViewer;
