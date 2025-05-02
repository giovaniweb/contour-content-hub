
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarSuggestion, updateCalendarCompletion } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, Video, Image, Instagram, FileText, Clock, AlertCircle 
} from "lucide-react";

interface CalendarDayProps {
  event: CalendarSuggestion;
  onRefresh?: () => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ event, onRefresh }) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(event.completed || false);
  
  const handleToggleCompletion = async (completed: boolean) => {
    try {
      setIsUpdating(true);
      await updateCalendarCompletion(event.date, completed);
      setIsCompleted(completed);
      
      toast({
        title: completed ? "Marcado como concluído" : "Marcado como pendente",
        description: `O evento "${event.title}" foi atualizado`,
      });
      
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o status do evento",
      });
      // Revert state if there was an error
      setIsCompleted(!completed);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const formatIcon = () => {
    switch (event.format) {
      case "video":
        return <Video className="h-5 w-5 text-blue-500" />;
      case "image":
        return <Image className="h-5 w-5 text-green-500" />;
      case "story":
        return <Instagram className="h-5 w-5 text-pink-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <Card className={`${isCompleted ? 'bg-gray-50' : ''}`}>
      <CardHeader className="pb-2 flex flex-row justify-between items-start">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            {formatIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`font-medium ${isCompleted ? 'text-gray-500 line-through' : ''}`}>
                {event.title}
              </h3>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{new Date(event.date).toLocaleDateString('pt-BR')}</span>
              {event.equipment && (
                <Badge variant="outline" className="ml-2 text-xs">
                  {event.equipment}
                </Badge>
              )}
              {event.format && (
                <Badge variant="outline" className="ml-0.5 text-xs">
                  {event.format === 'video' ? 'Vídeo' : event.format === 'image' ? 'Imagem' : 'Story'}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <Checkbox
            checked={isCompleted}
            disabled={isUpdating}
            className={`h-5 w-5 ${isCompleted ? 'text-green-500' : ''}`}
            onCheckedChange={(checked) => handleToggleCompletion(checked as boolean)}
          />
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm leading-relaxed mb-2">{event.description}</p>
        
        {event.hook && (
          <div className="bg-blue-50 p-2 rounded-md text-sm mb-2">
            <div className="font-medium flex items-center text-blue-700 mb-0.5">
              <AlertCircle className="h-3.5 w-3.5 mr-1" />
              Gancho sugerido
            </div>
            <p className="text-blue-600">{event.hook}</p>
          </div>
        )}
        
        {event.caption && (
          <div className="bg-gray-50 p-2 rounded-md text-sm mt-3">
            <div className="font-medium flex items-center text-gray-700 mb-0.5">
              <FileText className="h-3.5 w-3.5 mr-1" />
              Legenda sugerida
            </div>
            <p className="text-gray-600">{event.caption}</p>
          </div>
        )}
        
        <div className="flex items-center justify-end mt-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs flex items-center gap-1"
          >
            <Clock className="h-3 w-3" />
            Reagendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarDay;
