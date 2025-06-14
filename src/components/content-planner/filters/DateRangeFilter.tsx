
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface DateRangeFilterProps {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ value, onChange }) => {
  // Always ensure we have a safe value object with from/to properties
  const safeValue = value || { from: undefined, to: undefined };
  
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left text-sm h-9 font-normal",
              (!safeValue.from && !safeValue.to) && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {safeValue.from ? (
              safeValue.to ? (
                <>
                  {format(safeValue.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                  {format(safeValue.to, "dd/MM/yyyy", { locale: ptBR })}
                </>
              ) : (
                format(safeValue.from, "dd/MM/yyyy", { locale: ptBR })
              )
            ) : (
              "Data de publicação"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={safeValue}
            onSelect={onChange}
            initialFocus
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
