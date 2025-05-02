
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarSuggestion, updateCalendarCompletion } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle2, 
  FileText, 
  Clock, 
  Video, 
  Image, 
  MessageSquare,
  Calendar as CalendarIcon
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { getScriptById, ScriptHistoryItem } from "@/utils/api-scripts";

interface CalendarDayProps {
  date: Date;
  suggestion?: CalendarSuggestion;
  isCurrentMonth: boolean;
  onUpdate?: () => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  suggestion,
  isCurrentMonth,
  onUpdate
}) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [associatedScript, setAssociatedScript] = useState<ScriptHistoryItem | null>(null);
  const [isLoadingScript, setIsLoadingScript] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const isToday = new Date().toDateString() === date.toDateString();
  const dateStr = format(date, "yyyy-MM-dd");

  // Carregar roteiro associado quando abrir o diálogo se tiver um ID
  useEffect(() => {
    if (dialogOpen && suggestion?.completed && suggestion?.evento_agenda_id) {
      setIsLoadingScript(true);
      getScriptById(suggestion.evento_agenda_id)
        .then(script => {
          setAssociatedScript(script);
        })
        .catch(error => {
          console.error("Erro ao carregar roteiro:", error);
          setAssociatedScript(null);
        })
        .finally(() => {
          setIsLoadingScript(false);
        });
    }
  }, [dialogOpen, suggestion]);

  // Manipular clique na tarefa
  const handleTaskClick = () => {
    if (suggestion) {
      setDialogOpen(true);
    }
  };

  // Marcar como concluído
  const handleToggleComplete = async () => {
    try {
      if (!suggestion) return;
      
      setIsCompleting(true);
      const newStatus = !suggestion.completed;
      
      await updateCalendarCompletion(dateStr, newStatus);
      
      toast({
        title: newStatus ? "Tarefa concluída" : "Tarefa pendente",
        description: `Status da tarefa atualizado para ${newStatus ? "concluída" : "pendente"}`,
      });
      
      if (onUpdate) onUpdate();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o status da tarefa",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  // Ver roteiro associado
  const handleViewScript = () => {
    if (suggestion?.evento_agenda_id) {
      navigate(`/script-history/${suggestion.evento_agenda_id}`);
      setDialogOpen(false);
    }
  };

  // Obter ícone com base no formato do conteúdo
  const getFormatIcon = () => {
    if (!suggestion) return null;
    
    switch (suggestion.format) {
      case "video":
        return <Video className="h-3 w-3" />;
      case "image":
        return <Image className="h-3 w-3" />;
      case "story":
        return <MessageSquare className="h-3 w-3" />;
      default:
        return <FileText className="h-3 w-3" />;
    }
  };

  // Classes para o dia
  const dayClasses = `
    min-h-[80px] p-1 border rounded-md transition-colors relative
    ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
    ${isToday ? 'border-blue-400 border-2' : 'border-gray-200'}
    ${suggestion ? 'cursor-pointer hover:border-blue-300' : 'cursor-default'}
  `;

  // Classes para o container de tarefas
  const taskContainerClasses = `
    mt-1 text-xs
    ${suggestion?.completed ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50'}
    rounded p-1
  `;

  return (
    <>
      <div className={dayClasses} onClick={handleTaskClick}>
        {/* Data */}
        <div className="flex justify-between items-center">
          <span className={`text-xs font-medium ${isToday ? 'text-blue-600' : ''}`}>
            {date.getDate()}
          </span>
          {isToday && (
            <span className="text-xs px-1 bg-blue-100 text-blue-800 rounded">Hoje</span>
          )}
        </div>
        
        {/* Tarefa */}
        {suggestion && (
          <div className={taskContainerClasses}>
            <div className="flex items-center gap-1 text-[10px] font-medium">
              {getFormatIcon()}
              <span className="truncate">{suggestion.title.substring(0, 20)}{suggestion.title.length > 20 ? '...' : ''}</span>
            </div>
            {suggestion.completed && (
              <div className="flex items-center gap-1 mt-1 text-green-600">
                <CheckCircle2 className="h-3 w-3" />
                <span className="text-[10px]">Concluído</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Diálogo com detalhes da tarefa */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>
              <div className="flex justify-between items-center">
                <div className="truncate pr-4">{suggestion?.title}</div>
                <div className="text-sm font-normal text-muted-foreground whitespace-nowrap">
                  {format(date, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {suggestion && (
            <div className="space-y-4 py-2">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="flex items-center gap-1">
                  {getFormatIcon()}
                  {suggestion.format === "video" ? "Vídeo" : 
                   suggestion.format === "story" ? "Story" : "Imagem"}
                </Badge>
                
                {suggestion.equipment && (
                  <Badge variant="outline" className="bg-blue-50">
                    {suggestion.equipment}
                  </Badge>
                )}
                
                {suggestion.purpose && (
                  <Badge variant="outline" className="bg-purple-50">
                    {suggestion.purpose === "educate" ? "Educar" : 
                     suggestion.purpose === "engage" ? "Engajar" : "Vender"}
                  </Badge>
                )}
              </div>
              
              <div className="border rounded-md p-3 bg-gray-50">
                <h4 className="font-medium mb-2 text-sm">Descrição</h4>
                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
              </div>
              
              {suggestion.hook && (
                <div className="border rounded-md p-3 bg-blue-50">
                  <h4 className="font-medium mb-1 text-sm text-blue-700">Gancho sugerido</h4>
                  <p className="text-sm text-blue-600">"{suggestion.hook}"</p>
                </div>
              )}
              
              {suggestion.caption && (
                <div className="border rounded-md p-3 bg-amber-50">
                  <h4 className="font-medium mb-1 text-sm text-amber-700">Legenda sugerida</h4>
                  <p className="text-sm text-amber-600">{suggestion.caption}</p>
                </div>
              )}
              
              <div className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDialogOpen(false)}
                >
                  Fechar
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    disabled={!suggestion.completed || !suggestion.evento_agenda_id}
                    onClick={handleViewScript}
                  >
                    <FileText className="h-4 w-4" />
                    Ver Roteiro
                  </Button>
                  
                  <Button
                    variant={suggestion.completed ? "outline" : "default"}
                    size="sm"
                    className={`flex items-center gap-2 ${suggestion.completed ? 'text-green-700 border-green-300 hover:bg-green-50' : ''}`}
                    onClick={handleToggleComplete}
                    disabled={isCompleting}
                  >
                    {suggestion.completed ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Concluído
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4" />
                        Marcar Concluído
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CalendarDay;
