import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Draggable } from "@hello-pangea/dnd";
import { ContentPlannerItem } from "@/types/content-planner";
import { Calendar, FileText, Check, ArrowRight, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ContentPlannerCardProps {
  item: ContentPlannerItem;
  index: number;
  onEdit: (item: ContentPlannerItem) => void;
  onDelete: (id: string) => void;
  onGenerateScript?: (item: ContentPlannerItem) => void;
  onValidate?: (item: ContentPlannerItem) => void;
  onSchedule?: (item: ContentPlannerItem) => void;
  onViewDetails?: (item: ContentPlannerItem) => void; // New prop for detailed view
}

const ContentPlannerCard: React.FC<ContentPlannerCardProps> = ({
  item,
  index,
  onEdit,
  onDelete,
  onGenerateScript,
  onValidate,
  onSchedule,
  onViewDetails
}) => {
  // Format objective for display
  const formatObjective = (objective: string) => {
    // Remove emoji if present
    if (objective.includes(' ')) {
      const parts = objective.split(' ');
      if (parts[0].length <= 2) {
        // Likely an emoji, return the rest
        return parts.slice(1).join(' ');
      }
    }
    return objective;
  };
  
  // Handle click on the card
  const handleCardClick = (e: React.MouseEvent) => {
    // If clicking on a button, prevent opening the detailed view
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    
    // Open detailed view
    if (onViewDetails) {
      onViewDetails(item);
    }
  };
  
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-3"
          onClick={handleCardClick}
        >
          <Card className="bg-card shadow-sm hover:shadow-md transition-all cursor-pointer">
            <CardHeader className="py-3 px-4">
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-medium line-clamp-2">{item.title}</h3>
                {item.aiGenerated && (
                  <Badge variant="outline" className="ml-2 bg-purple-100 text-purple-800 border-purple-200">
                    <Sparkles className="h-3 w-3 mr-1" />
                    IA
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="py-2 px-4">
              <div className="flex flex-wrap gap-1 mb-2">
                {item.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              {/* Status indicators */}
              <div className="flex flex-col gap-1 text-xs">
                {/* Format & Objective */}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Formato:</span>
                  <Badge variant="outline" className="font-normal">
                    {item.format}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Objetivo:</span>
                  <Badge 
                    variant="outline" 
                    className={`font-normal ${
                      item.objective.includes('Atrair') 
                        ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                        : item.objective.includes('Conexão')
                          ? 'bg-green-50 text-green-800 border-green-200'
                          : item.objective.includes('Comprar')
                            ? 'bg-red-50 text-red-800 border-red-200'
                            : item.objective.includes('Reativar')
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : item.objective.includes('Fechar')
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : ''
                    }`}
                  >
                    {formatObjective(item.objective)}
                  </Badge>
                </div>
                
                {/* Equipment & Distribution */}
                {item.equipmentName && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Equipamento:</span>
                    <span className="font-medium">{item.equipmentName}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Canal:</span>
                  <span className="font-medium">{item.distribution}</span>
                </div>
                
                {/* Script ID */}
                {item.scriptId && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Roteiro:</span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                      <FileText className="h-3 w-3 mr-1" />
                      Vinculado
                    </Badge>
                  </div>
                )}
                
                {/* Scheduled date */}
                {item.scheduledDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Data:</span>
                    <span className="font-medium">
                      {format(new Date(item.scheduledDate), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="px-4 py-2 flex flex-wrap gap-1 justify-between">
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(item);
                  }}
                >
                  Editar
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                >
                  Remover
                </Button>
              </div>
              
              <div className="flex gap-1">
                {/* Action buttons based on status */}
                {item.status === 'idea' && onGenerateScript && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onGenerateScript(item);
                    }}
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    Gerar Roteiro
                  </Button>
                )}
                
                {item.status === 'script_generated' && onValidate && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onValidate(item);
                    }}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Validar
                  </Button>
                )}
                
                {item.status === 'approved' && onSchedule && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSchedule(item);
                    }}
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    Agendar
                  </Button>
                )}
                
                {item.status === 'scheduled' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    disabled
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ArrowRight className="h-3 w-3 mr-1" />
                    Publicar
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default ContentPlannerCard;
