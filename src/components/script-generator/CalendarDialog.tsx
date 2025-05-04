import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { linkScriptToCalendar } from "@/utils/api";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CalendarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scriptId: string;
  scriptTitle?: string;
  scriptType?: string;
  onSuccess?: (date: Date, eventId: string) => void;
}

export function CalendarDialog({ 
  open, 
  onOpenChange, 
  scriptId, 
  scriptTitle, 
  scriptType,
  onSuccess 
}: CalendarDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isScheduling, setIsScheduling] = useState(false);
  const { toast } = useToast();

  const handleSchedule = async () => {
    if (!selectedDate) {
      toast({
        variant: "destructive",
        title: "Selecione uma data",
        description: "Por favor, selecione uma data para agendar o conteúdo",
      });
      return;
    }

    try {
      setIsScheduling(true);
      
      // Generate a temporary event ID (in a real implementation, this would come from the backend)
      const eventId = `temp-${Date.now()}`;
      
      // Link the script to the calendar event
      const success = await linkScriptToCalendar(scriptId, eventId);
      
      if (success) {
        toast({
          title: "Conteúdo agendado com sucesso",
          description: `"${scriptTitle || 'Conteúdo'}" foi agendado para ${format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}`,
        });
        
        if (onSuccess) {
          onSuccess(selectedDate, eventId);
        }
        
        onOpenChange(false);
      } else {
        throw new Error("Não foi possível agendar o conteúdo");
      }
    } catch (error) {
      console.error("Erro ao agendar conteúdo:", error);
      toast({
        variant: "destructive",
        title: "Erro ao agendar",
        description: "Ocorreu um erro ao tentar agendar o conteúdo",
      });
    } finally {
      setIsScheduling(false);
    }
  };

  const getScriptTypeLabel = () => {
    if (!scriptType) return "Conteúdo";
    
    switch (scriptType) {
      case "videoScript":
        return "Roteiro para Vídeo";
      case "bigIdea":
        return "Campanha Criativa";
      case "dailySales":
        return "Story";
      default:
        return "Conteúdo";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-blue-500" />
            Agendar Conteúdo no Calendário
          </DialogTitle>
          <DialogDescription>
            Escolha uma data para publicar seu {getScriptTypeLabel().toLowerCase()}: <span className="font-medium">{scriptTitle || 'Sem título'}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex justify-center mb-6">
            <Calendar
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
                O conteúdo será agendado para<br />
                {format(selectedDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSchedule}
            disabled={!selectedDate || isScheduling}
          >
            {isScheduling ? "Agendando..." : "Agendar Publicação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
