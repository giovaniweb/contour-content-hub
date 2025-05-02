
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CalendarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSchedule: (date: Date | undefined, timeSlot: string) => Promise<void>;
  scriptId: string;
}

const CalendarDialog: React.FC<CalendarDialogProps> = ({
  open,
  onOpenChange,
  onSchedule,
  scriptId
}) => {
  const [date, setDate] = useState<Date>();
  const [timeSlot, setTimeSlot] = useState("morning");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!date) return;
    
    try {
      setIsSubmitting(true);
      await onSchedule(date, timeSlot);
      // Reset form state after successful scheduling
      setDate(undefined);
      setTimeSlot("morning");
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao agendar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogChange = (open: boolean) => {
    if (!open && !isSubmitting) {
      // Reset state when dialog is closed
      setDate(undefined);
      setTimeSlot("morning");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agendar Publicação</DialogTitle>
          <DialogDescription>
            Selecione uma data e período para agendar seu conteúdo.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="date">Selecione a data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time-slot">Período preferencial</Label>
            <Select
              value={timeSlot}
              onValueChange={setTimeSlot}
              disabled={isSubmitting}
            >
              <SelectTrigger id="time-slot" className="w-full">
                <SelectValue placeholder="Selecione um período" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Período do dia</SelectLabel>
                  <SelectItem value="morning">Manhã (08:00 - 11:00)</SelectItem>
                  <SelectItem value="noon">Meio-dia (11:00 - 14:00)</SelectItem>
                  <SelectItem value="afternoon">Tarde (14:00 - 17:00)</SelectItem>
                  <SelectItem value="evening">Noite (17:00 - 20:00)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="ghost" 
            onClick={() => handleDialogChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!date || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Agendando...
              </>
            ) : (
              "Agendar Publicação"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarDialog;
