
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
import { CalendarIcon, FileText, Check } from "lucide-react";
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
        return "Video Script";
      case "bigIdea":
        return "Big Idea";
      case "dailySales":
        return "Daily Sales";
      default:
        return "Content";
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
          ? "Task reopened" 
          : "Task completed",
        description: suggestion.completed
          ? "The task has been marked as not completed"
          : "Great job! The task has been marked as completed",
      });
      
      if (onUpdate) onUpdate();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Could not update task status",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleCreateContent = () => {
    if (!suggestion) return;
    
    // Navigate to script generator with pre-filled type
    navigate(`/script-generator?type=${suggestion.type}`);
  };
  
  return (
    <div 
      className={`
        h-28 md:h-36 p-2 border rounded-md overflow-hidden
        ${isCurrentMonth ? "bg-white" : "bg-gray-50/50"}
        ${isToday ? "ring-2 ring-reelline-primary ring-offset-2" : ""}
      `}
    >
      <div className="flex justify-between items-center mb-1">
        <span 
          className={`
            text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center
            ${isToday ? "bg-reelline-primary text-white" : ""}
          `}
        >
          {day}
        </span>
        
        {suggestion?.completed && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Check className="h-3 w-3 mr-1" />
            Done
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
                <Badge variant="secondary" className="mb-1 text-xs">
                  {getScriptTypeLabel(suggestion.type)}
                </Badge>
                <p className="text-xs font-medium truncate">{suggestion.title}</p>
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span>
                    {date.toLocaleDateString("en-US", { 
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
              <Badge variant="secondary" className="mb-3">
                {getScriptTypeLabel(suggestion.type)}
              </Badge>
              
              <p className="text-sm mb-4">
                {suggestion.description}
              </p>
              
              {suggestion.completed ? (
                <div className="bg-green-50 border border-green-200 p-3 rounded-md flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-green-700 font-medium">
                    Content completed
                  </span>
                </div>
              ) : isPast ? (
                <div className="bg-orange-50 border border-orange-200 p-3 rounded-md">
                  <p className="text-orange-700">
                    This date is in the past. Would you like to create this content now?
                  </p>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
                  <p className="text-blue-700">
                    Get ahead of schedule by creating this content now.
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
                {suggestion.completed ? "Reopen Task" : "Mark as Done"}
              </Button>
              
              {!suggestion.completed && (
                <Button onClick={handleCreateContent}>
                  <FileText className="h-4 w-4 mr-2" />
                  Create Content Now
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
