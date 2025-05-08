
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ContentPlannerItem } from "@/types/content-planner";
import { Clock } from "lucide-react";

interface ContentPlannerScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ContentPlannerItem;
  onSchedule: (item: ContentPlannerItem, date: Date) => Promise<void>;
}

const ContentPlannerScheduleDialog: React.FC<ContentPlannerScheduleDialogProps> = ({
  open,
  onOpenChange,
  item,
  onSchedule
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    item.scheduledDate ? new Date(item.scheduledDate) : new Date()
  );
  const [timeSlot, setTimeSlot] = useState("morning");
  const [isScheduling, setIsScheduling] = useState(false);
  
  const handleSchedule = async () => {
    if (!selectedDate) return;
    
    // Apply time based on selected slot to the date
    const dateToSchedule = new Date(selectedDate);
    
    switch (timeSlot) {
      case 'morning':
        dateToSchedule.setHours(9, 0, 0);
        break;
      case 'noon':
        dateToSchedule.setHours(12, 0, 0);
        break;
      case 'afternoon':
        dateToSchedule.setHours(15, 0, 0);
        break;
      case 'evening':
        dateToSchedule.setHours(19, 0, 0);
        break;
      default:
        dateToSchedule.setHours(9, 0, 0);
    }
    
    setIsScheduling(true);
    
    try {
      await onSchedule(item, dateToSchedule);
      onOpenChange(false);
    } finally {
      setIsScheduling(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Agendar Conteúdo</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              locale={ptBR}
              initialFocus
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timeSlot">Período do dia</Label>
            <Select value={timeSlot} onValueChange={setTimeSlot}>
              <SelectTrigger id="timeSlot">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Manhã (09:00)</SelectItem>
                <SelectItem value="noon">Meio-dia (12:00)</SelectItem>
                <SelectItem value="afternoon">Tarde (15:00)</SelectItem>
                <SelectItem value="evening">Noite (19:00)</SelectItem>
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
        
        <DialogFooter>
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            disabled={isScheduling}
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
};

export default ContentPlannerScheduleDialog;
