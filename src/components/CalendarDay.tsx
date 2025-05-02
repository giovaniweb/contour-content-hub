
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CalendarIcon,
  FileText,
  Check,
  Video,
  Image,
  MessageCircle,
  BookOpen,
  Users,
  ShoppingBag,
  Sparkles
} from "lucide-react";
import { CalendarSuggestion, updateCalendarCompletion } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

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
  const [isUpdating, setIsUpdating] = React.useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const day = date.getDate();
  const isToday = new Date().toDateString() === date.toDateString();
  const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
  
  // Get script type label
  const getScriptTypeLabel = (type: string) => {
    switch (type) {
      case "videoScript":
        return "Vídeo";
      case "bigIdea":
        return "Campanha";
      case "dailySales":
        return "Story";
      default:
        return "Conteúdo";
    }
  };
  
  // Get purpose icon based on content purpose
  const getPurposeIcon = (type: string) => {
    switch (type) {
      case "videoScript":
        return <BookOpen className="h-4 w-4" />; // Educate
      case "bigIdea":
        return <Users className="h-4 w-4" />; // Engage
      case "dailySales":
        return <ShoppingBag className="h-4 w-4" />; // Sell
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };
  
  // Get content type icon
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "videoScript":
        return <Video className="h-4 w-4" />;
      case "dailySales":
        return <MessageCircle className="h-4 w-4" />;
      case "bigIdea":
        return <Image className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleToggleCompleted = async () => {
    if (!suggestion) return;
    
    try {
      setIsUpdating(true);
      await updateCalendarCompletion(
        suggestion.date,
        !suggestion.completed
      );
      
      toast({
        title: suggestion.completed 
          ? "Tarefa reaberta" 
          : "Tarefa concluída",
        description: suggestion.completed
          ? "A tarefa foi marcada como não concluída"
          : "Ótimo trabalho! A tarefa foi marcada como concluída",
      });
      
      if (onUpdate) onUpdate();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Falha na atualização",
        description: "Não foi possível atualizar o status da tarefa",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleCreateContent = () => {
    if (!suggestion) return;
    
    // Navigate to script generator with pre-filled type and topic from suggestion
    navigate(`/script-generator?type=${suggestion.type}&topic=${encodeURIComponent(suggestion.title)}`);
  };
  
  return (
    <div 
      className={`
        h-28 md:h-36 p-2 border rounded-md overflow-hidden
        ${isCurrentMonth ? "bg-white" : "bg-gray-50/50"}
        ${isToday ? "ring-2 ring-primary ring-offset-2" : ""}
        ${suggestion?.completed ? "border-green-300 bg-green-50" : ""}
      `}
    >
      <div className="flex justify-between items-center mb-1">
        <span 
          className={`
            text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center
            ${isToday ? "bg-primary text-white" : ""}
          `}
        >
          {day}
        </span>
        
        {suggestion?.completed && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-1 py-0">
            <Check className="h-3 w-3" />
          </Badge>
        )}
      </div>
      
      {suggestion && (
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full h-auto p-1 justify-start text-left"
            >
              <div className="w-full">
                <div className="flex items-center gap-1 mb-1">
                  {getContentTypeIcon(suggestion.type)}
                  <Badge variant="secondary" className="text-xs">
                    {getScriptTypeLabel(suggestion.type)}
                  </Badge>
                </div>
                <p className="text-xs font-medium truncate">{suggestion.title}</p>
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span>
                    {date.toLocaleDateString("pt-BR", { 
                      month: "long", 
                      day: "numeric",
                      year: "numeric"
                    })}
                  </span>
                </div>
              </DialogTitle>
              <DialogDescription>
                {suggestion.title}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary" className="flex items-center gap-1">
                  {getContentTypeIcon(suggestion.type)}
                  {getScriptTypeLabel(suggestion.type)}
                </Badge>
                
                <Badge variant="outline" className="flex items-center gap-1">
                  {getPurposeIcon(suggestion.type)}
                  {suggestion.type === "videoScript" ? "Educar" : 
                   suggestion.type === "bigIdea" ? "Engajar" : "Vender"}
                </Badge>
                
                {suggestion.equipment && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {suggestion.equipment}
                  </Badge>
                )}
              </div>
              
              <p className="text-sm mb-4">
                {suggestion.description}
              </p>
              
              {suggestion.completed ? (
                <div className="bg-green-50 border border-green-200 p-3 rounded-md flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-green-700 font-medium">
                    Conteúdo concluído
                  </span>
                </div>
              ) : isPast ? (
                <div className="bg-orange-50 border border-orange-200 p-3 rounded-md">
                  <p className="text-orange-700">
                    Esta data está no passado. Gostaria de criar este conteúdo agora?
                  </p>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
                  <p className="text-blue-700">
                    Adiantece na sua agenda criando este conteúdo agora.
                  </p>
                </div>
              )}
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant={suggestion.completed ? "outline" : "default"}
                onClick={handleToggleCompleted}
                disabled={isUpdating}
                className={suggestion.completed ? "sm:mr-auto" : ""}
              >
                {suggestion.completed ? "Reabrir Tarefa" : "Marcar como Concluída"}
              </Button>
              
              {!suggestion.completed && (
                <Button onClick={handleCreateContent}>
                  <FileText className="h-4 w-4 mr-2" />
                  Gerar Roteiro Agora
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CalendarDay;
