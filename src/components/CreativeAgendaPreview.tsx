
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface UpcomingTask {
  id: string;
  date: string;
  title: string;
  type: string;
  completed: boolean;
}

interface CreativeAgendaPreviewProps {
  upcomingTasks?: UpcomingTask[];
}

const CreativeAgendaPreview: React.FC<CreativeAgendaPreviewProps> = ({ upcomingTasks = [] }) => {
  // Exemplo de tarefas se não forem fornecidas
  const defaultTasks: UpcomingTask[] = [
    {
      id: "1",
      date: "2025-05-02",
      title: "Vídeo sobre tratamento facial",
      type: "videoScript",
      completed: false
    },
    {
      id: "2",
      date: "2025-05-04",
      title: "Promoção especial de sábado",
      type: "dailySales",
      completed: true
    },
    {
      id: "3",
      date: "2025-05-07",
      title: "Campanha estratégica mensal",
      type: "bigIdea",
      completed: false
    }
  ];

  const tasks = upcomingTasks.length > 0 ? upcomingTasks : defaultTasks;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };
  
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "videoScript": return "Vídeo";
      case "dailySales": return "Venda";
      case "bigIdea": return "Campanha";
      default: return type;
    }
  };

  return (
    <Card className="border border-gray-100 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center text-contourline-darkBlue">
            <Calendar className="mr-2 h-5 w-5" /> Agenda Criativa
          </CardTitle>
          <Link to="/calendar">
            <Button variant="ghost" size="sm" className="text-contourline-mediumBlue">
              Ver todos <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <CardDescription>
          Próximas publicações planejadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className={`flex items-center p-3 rounded-md ${task.completed ? 'bg-contourline-mediumBlue/10' : 'bg-contourline-lightGray/50'}`}
            >
              {task.completed ? (
                <CalendarCheck className="h-5 w-5 text-contourline-mediumBlue mr-3 shrink-0" />
              ) : (
                <Calendar className="h-5 w-5 text-contourline-darkBlue/70 mr-3 shrink-0" />
              )}
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-contourline-darkBlue">{task.title}</span>
                  <span className="text-sm text-contourline-darkBlue/70">{formatDate(task.date)}</span>
                </div>
                <div className="flex items-center mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-contourline-lightBlue/30 text-contourline-darkBlue">
                    {getTypeLabel(task.type)}
                  </span>
                  {task.completed && (
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                      Concluído
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" className="w-full">
          Ver minha agenda completa
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreativeAgendaPreview;
