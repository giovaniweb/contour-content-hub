
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CalendarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSchedule: (date: Date, timeSlot: string) => Promise<void>;
  scriptId: string;
}

export function CalendarDialog({ 
  open, 
  onOpenChange, 
  onSchedule,
  scriptId
}: CalendarDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("morning");
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
      
      await onSchedule(selectedDate, selectedTimeSlot);
      
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-blue-500" />
            Agendar Conteúdo no Calendário
          </DialogTitle>
          <DialogDescription>
            Escolha uma data e horário para publicar seu conteúdo
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
          
          <div className="space-y-2">
            <Label htmlFor="timeSlot">Período do dia</Label>
            <Select
              value={selectedTimeSlot}
              onValueChange={setSelectedTimeSlot}
            >
              <SelectTrigger id="timeSlot">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Manhã</SelectItem>
                <SelectItem value="noon">Meio-dia</SelectItem>
                <SelectItem value="afternoon">Tarde</SelectItem>
                <SelectItem value="evening">Noite</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {selectedDate && (
            <div className="bg-muted/30 p-3 rounded-md text-center mt-4">
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

export default CalendarDialog;
