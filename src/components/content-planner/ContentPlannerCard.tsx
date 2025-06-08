
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Draggable } from "@hello-pangea/dnd";
import { ContentPlannerItem } from "@/types/content-planner";
import { Calendar, FileText, Check, ArrowRight, Sparkles, CheckSquare } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface ContentPlannerCardProps {
  item: ContentPlannerItem;
  index: number;
  onEdit: (item: ContentPlannerItem) => void;
  onDelete: (id: string) => void;
  onGenerateScript?: (item: ContentPlannerItem) => void;
  onValidate?: (item: ContentPlannerItem) => void;
  onSchedule?: (item: ContentPlannerItem) => void;
  onViewDetails?: (item: ContentPlannerItem) => void;
}

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: 'thumbnail', label: 'Criar thumbnail', checked: false },
    { id: 'caption', label: 'Criar legenda', checked: false },
    { id: 'schedule', label: 'Agendar postagem', checked: false },
    { id: 'instagram', label: 'Postar no Instagram', checked: false },
    { id: 'youtube', label: 'Postar no YouTube Shorts', checked: false },
    { id: 'tiktok', label: 'Postar no TikTok', checked: false },
  ]);
  
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
  
  // Handle clicking on a checklist item
  const handleChecklistItemChange = (id: string, checked: boolean) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, checked } : item
      )
    );
  };
  
  // Calculate checklist completion percentage
  const completedTasks = checklist.filter(item => item.checked).length;
  const totalTasks = checklist.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Handle click on the card
  const handleCardClick = (e: React.MouseEvent) => {
    // If clicking on a button, prevent opening the detailed view
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    
    // Open detailed view
    setShowDetailsModal(true);
  };
  
  return (
    <>
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
                  
                  {/* Distribution channels */}
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
                  
                  {/* Checklist progress - Show for approved items */}
                  {item.status === 'approved' && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span className="flex items-center gap-1">
                          <CheckSquare className="h-3 w-3" /> Checklist
                        </span>
                        <span>{completedTasks}/{totalTasks}</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-fluida-blue to-fluida-pink" 
                          style={{ width: `${completionPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Scheduled date */}
                  {item.scheduledDate && (
                    <div className="flex items-center justify-between mt-2">
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
                  
                  {item.status === 'approved' && onValidate && (
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
                  
                  {item.status === 'published' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      disabled
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ArrowRight className="h-3 w-3 mr-1" />
                      Publicado
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          </div>
        )}
      </Draggable>
      
      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">{item.title}</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {/* Script Content */}
            {item.description && (
              <div className="mb-6">
                <h4 className="font-medium mb-2">Roteiro:</h4>
                <div className="bg-muted/40 p-3 rounded-md text-sm whitespace-pre-line">
                  {item.description}
                </div>
              </div>
            )}
            
            {/* Metadata */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6">
              <div>
                <span className="text-sm text-muted-foreground">Formato:</span>
                <p className="font-medium">{item.format}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Objetivo:</span>
                <p className="font-medium">{formatObjective(item.objective)}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Distribuição:</span>
                <p className="font-medium">{item.distribution}</p>
              </div>
              {item.scheduledDate && (
                <div>
                  <span className="text-sm text-muted-foreground">Data:</span>
                  <p className="font-medium">
                    {format(new Date(item.scheduledDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
              )}
            </div>
            
            {/* Checklist - Show for approved items */}
            {item.status === 'approved' && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <CheckSquare className="h-4 w-4" /> 
                  Checklist de produção:
                </h4>
                <div className="space-y-2">
                  {checklist.map((checkItem) => (
                    <div key={checkItem.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${item.id}-${checkItem.id}`}
                        checked={checkItem.checked}
                        onCheckedChange={(checked) => 
                          handleChecklistItemChange(checkItem.id, checked === true)
                        }
                      />
                      <label
                        htmlFor={`${item.id}-${checkItem.id}`}
                        className={`text-sm ${
                          checkItem.checked ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {checkItem.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline"
              size="sm" 
              onClick={() => setShowDetailsModal(false)}
            >
              Fechar
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-fluida-blue to-fluida-pink text-white"
              onClick={() => {
                setShowDetailsModal(false);
                onEdit(item);
              }}
            >
              Editar Conteúdo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContentPlannerCard;
