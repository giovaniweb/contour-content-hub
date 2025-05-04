
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CalendarSuggestion } from '@/types/calendar';

export interface CalendarDayProps {
  date: Date;
  events: CalendarSuggestion[];
  onClick: () => void;
  onEventCompletion: (event: CalendarSuggestion, completed: boolean) => Promise<void>;
  isCurrentMonth: boolean;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ 
  date, 
  events, 
  onClick, 
  onEventCompletion, 
  isCurrentMonth 
}) => {
  const dayNumber = date.getDate();
  
  const handleToggleCompletion = async (event: CalendarSuggestion, e: React.MouseEvent) => {
    e.stopPropagation();
    await onEventCompletion(event, !event.completed);
  };
  
  return (
    <Card 
      className={cn(
        "min-h-[100px] p-2 hover:bg-accent/50 cursor-pointer flex flex-col",
        isCurrentMonth ? "bg-card" : "bg-muted/50",
      )}
      onClick={onClick}
    >
      <div className="text-sm font-medium self-end mb-1">
        {dayNumber}
      </div>
      
      <div className="flex-1 flex flex-col gap-1 mt-1 overflow-y-auto">
        {events.map((event) => (
          <div 
            key={event.id} 
            className={cn(
              "text-xs p-1 rounded flex items-center gap-1 group",
              event.completed ? "bg-primary/20 text-primary" : "bg-secondary/20",
              event.format === "video" && "border-l-2 border-blue-500",
              event.format === "story" && "border-l-2 border-purple-500",
              event.format === "image" && "border-l-2 border-green-500"
            )}
          >
            <Button
              size="icon"
              variant="ghost"
              className="h-4 w-4 p-0 opacity-70 hover:opacity-100"
              onClick={(e) => handleToggleCompletion(event, e)}
            >
              {event.completed ? (
                <Check className="h-3 w-3" />
              ) : (
                <Clock className="h-3 w-3" />
              )}
            </Button>
            <span className="truncate flex-1">
              {event.title}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CalendarDay;
