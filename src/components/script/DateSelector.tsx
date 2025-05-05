
import React from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DateSelectorProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, setSelectedDate }) => {
  return (
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
  );
};

export default DateSelector;
