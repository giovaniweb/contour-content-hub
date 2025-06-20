"use client";

import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale"; // Importar localidade pt-BR
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils"; // Supondo que cn exista para classnames
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?: Date | null;
  onValueChange: (date: Date | undefined) => void;
  className?: string;
  placeholder?: string;
}

export function DatePicker({ value, onValueChange, className, placeholder }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value || undefined);

  React.useEffect(() => {
    setDate(value || undefined);
  }, [value]);

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    onValueChange(selectedDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal bg-slate-700/60 border-cyan-500/40 hover:bg-slate-700 text-slate-100 hover:text-slate-50",
            !date && "text-slate-400",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP", { locale: ptBR }) : <span>{placeholder || "Escolha uma data"}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-slate-800 border-cyan-500/50 text-slate-100">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          locale={ptBR} // Aplicar localidade pt-BR ao calendário
        />
      </PopoverContent>
    </Popover>
  );
}
