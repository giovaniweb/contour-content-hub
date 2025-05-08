
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Plus, Calendar, FileText, Instagram, TikTok, Youtube } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useSlideNotifications } from '@/components/notifications/SlideNotificationProvider';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ContentPlannerItem } from '@/types/content-planner';
import { cn } from '@/lib/utils';

// Kanban column definition
interface KanbanColumn {
  id: string;
  title: string;
  items: KanbanItem[];
  color: string; // Color for visual indication
}

// Kanban item definition
interface KanbanItem {
  id: string;
  title: string;
  type: 'video' | 'post' | 'carrossel' | 'reels' | 'story';
  deadline?: string;
  platform?: string;
  status: string;
  subtasks: { id: string; text: string; completed: boolean }[];
}

// Initial columns data
const initialColumns: KanbanColumn[] = [
  {
    id: 'todo',
    title: 'To Do',
    items: [
      {
        id: 'task-1',
        title: 'Vídeo sobre tratamentos faciais',
        type: 'video',
        deadline: '2025-05-20',
        status: 'todo',
        subtasks: [
          { id: 'sub1-1', text: 'Escrever roteiro', completed: false },
          { id: 'sub1-2', text: 'Preparar equipamento', completed: true },
        ]
      },
      {
        id: 'task-2',
        title: 'Promoção de produtos para pele',
        type: 'post',
        deadline: '2025-05-18',
        status: 'todo',
        subtasks: [
          { id: 'sub2-1', text: 'Design de imagens', completed: false },
          { id: 'sub2-2', text: 'Redigir texto', completed: false },
        ]
      }
    ],
    color: 'bg-blue-50 border-blue-200 text-blue-700'
  },
  {
    id: 'in-production',
    title: 'In Production',
    items: [
      {
        id: 'task-3',
        title: 'Tutorial de uso do equipamento X',
        type: 'video',
        deadline: '2025-05-15',
        status: 'in-production',
        subtasks: [
          { id: 'sub3-1', text: 'Gravar vídeo', completed: false },
          { id: 'sub3-2', text: 'Editar conteúdo', completed: false },
        ]
      }
    ],
    color: 'bg-purple-50 border-purple-200 text-purple-700'
  },
  {
    id: 'review',
    title: 'Under Review',
    items: [
      {
        id: 'task-4',
        title: 'Comparativo de equipamentos',
        type: 'carrossel',
        deadline: '2025-05-12',
        status: 'review',
        subtasks: [
          { id: 'sub4-1', text: 'Revisar texto', completed: false },
          { id: 'sub4-2', text: 'Aprovar imagens', completed: true },
        ]
      }
    ],
    color: 'bg-amber-50 border-amber-200 text-amber-700'
  },
  {
    id: 'published',
    title: 'Published',
    items: [],
    color: 'bg-green-50 border-green-200 text-green-700'
  },
  {
    id: 'distributed',
    title: 'Distributed',
    items: [
      {
        id: 'task-5',
        title: 'Depoimento de cliente',
        type: 'reels',
        deadline: '2025-05-05',
        platform: 'Instagram',
        status: 'distributed',
        subtasks: [
          { id: 'sub5-1', text: 'Publicado no Instagram', completed: true },
          { id: 'sub5-2', text: 'Publicado no TikTok', completed: true },
        ]
      }
    ],
    color: 'bg-indigo-50 border-indigo-200 text-indigo-700'
  }
];

// Types for distribution platforms
interface DistributionPlatform {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
}

const distributionPlatforms: DistributionPlatform[] = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { id: 'tiktok', name: 'TikTok', icon: TikTok, color: 'text-black' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-500' }
];

// Component for a distribution suggestion
const DistributionSuggestion: React.FC<{ platform: DistributionPlatform }> = ({ platform }) => {
  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex items-center mb-2">
        <platform.icon className={cn("h-5 w-5 mr-2", platform.color)} />
        <h4 className="font-medium">Distribuir para {platform.name}</h4>
      </div>
      
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>• Sugestão de legenda adaptada para {platform.name}</p>
        <p>• Geração de thumbnail otimizada</p>
        <p>• Hashtags recomendadas: #conteudo #fluida #{platform.name}</p>
      </div>
      
      <Button variant="outline" size="sm" className="mt-3 w-full">
        Preparar para {platform.name}
      </Button>
    </div>
  );
};

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [selectedItem, setSelectedItem] = useState<KanbanItem | null>(null);
  const [showDistributionDialog, setShowDistributionDialog] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Record<string, boolean>>({
    'instagram': false,
    'tiktok': false,
    'youtube': false
  });
  const { showNotification } = useSlideNotifications();

  // Handle drag and drop
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // Dropped outside a droppable area
    if (!destination) return;

    // No movement
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Find source and destination columns
    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    // If moving within the same column
    if (source.droppableId === destination.droppableId) {
      const newItems = Array.from(sourceColumn.items);
      const [movedItem] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, movedItem);

      setColumns(columns.map(col => 
        col.id === source.droppableId ? { ...col, items: newItems } : col
      ));
    } else {
      // Moving from one column to another
      const sourceItems = Array.from(sourceColumn.items);
      const destItems = Array.from(destColumn.items);
      const [movedItem] = sourceItems.splice(source.index, 1);
      
      // Update status
      const updatedItem = { ...movedItem, status: destination.droppableId };
      
      destItems.splice(destination.index, 0, updatedItem);
      
      setColumns(columns.map(col => {
        if (col.id === source.droppableId) {
          return { ...col, items: sourceItems };
        }
        if (col.id === destination.droppableId) {
          return { ...col, items: destItems };
        }
        return col;
      }));

      // Trigger distribution modal if moved to published
      if (destination.droppableId === 'published') {
        setSelectedItem(updatedItem);
        setShowDistributionDialog(true);
      }
      
      // Show notification feedback
      showNotification({
        title: 'Status Atualizado',
        message: `Item movido para ${destColumn.title}`,
        type: 'success',
      });
    }
  };

  // Toggle subtask completion
  const toggleSubtaskCompletion = (itemId: string, subtaskId: string) => {
    setColumns(columns.map(col => ({
      ...col,
      items: col.items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            subtasks: item.subtasks.map(subtask => 
              subtask.id === subtaskId 
                ? { ...subtask, completed: !subtask.completed } 
                : subtask
            )
          };
        }
        return item;
      })
    })));
  };

  // Handle platform selection
  const handlePlatformChange = (platform: string) => {
    setSelectedPlatforms({
      ...selectedPlatforms,
      [platform]: !selectedPlatforms[platform]
    });
  };

  // Distribute content to selected platforms
  const distributeContent = () => {
    if (!selectedItem) return;

    // Update the item with distribution information
    setColumns(columns.map(col => ({
      ...col,
      items: col.items.map(item => {
        if (item.id === selectedItem.id) {
          // Create subtasks for each selected platform
          const platformSubtasks = Object.entries(selectedPlatforms)
            .filter(([_, isSelected]) => isSelected)
            .map(([platform, _], index) => ({
              id: `dist-${selectedItem.id}-${platform}`,
              text: `Publicado no ${distributionPlatforms.find(p => p.id === platform)?.name || platform}`,
              completed: true
            }));
          
          // Only move to distributed if at least one platform selected
          const hasSelectedPlatforms = Object.values(selectedPlatforms).some(Boolean);
          
          return {
            ...item,
            status: hasSelectedPlatforms ? 'distributed' : 'published',
            subtasks: [...item.subtasks, ...platformSubtasks],
          };
        }
        return item;
      })
    })));

    // Move item to distributed column if any platform selected
    if (Object.values(selectedPlatforms).some(Boolean)) {
      const publishedColumn = columns.find(col => col.id === 'published');
      const distributedColumn = columns.find(col => col.id === 'distributed');
      
      if (publishedColumn && distributedColumn && selectedItem) {
        const publishedItems = publishedColumn.items.filter(item => item.id !== selectedItem.id);
        const updatedItem = {
          ...selectedItem,
          status: 'distributed'
        };
        
        setColumns(columns.map(col => {
          if (col.id === 'published') {
            return { ...col, items: publishedItems };
          }
          if (col.id === 'distributed') {
            return { ...col, items: [...col.items, updatedItem] };
          }
          return col;
        }));
        
        showNotification({
          title: 'Conteúdo Distribuído',
          message: 'Seu conteúdo foi distribuído com sucesso',
          type: 'success',
        });
      }
    }
    
    setShowDistributionDialog(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Planner de Conteúdo</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Novo Conteúdo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Conteúdo</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <p>Funcionalidade a ser implementada.</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary">Cancelar</Button>
              <Button type="button">Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 pb-6 overflow-x-auto">
          {columns.map((column) => (
            <div key={column.id} className="min-w-[300px] max-w-[300px] flex-shrink-0">
              <div className={`rounded-t-lg p-3 ${column.color}`}>
                <h3 className="font-medium">{column.title} ({column.items.length})</h3>
              </div>
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "min-h-[500px] p-3 rounded-b-lg border-x border-b transition-colors",
                      snapshot.isDraggingOver ? "bg-slate-50" : "bg-white",
                      column.id === 'published' && "border-green-200",
                      column.id === 'distributed' && "border-indigo-200",
                      column.id === 'review' && "border-amber-200",
                      column.id === 'in-production' && "border-purple-200",
                      column.id === 'todo' && "border-blue-200"
                    )}
                  >
                    {column.items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                              "mb-3 shadow-sm hover:shadow-md transition-shadow",
                              snapshot.isDragging && "shadow-md rotate-2"
                            )}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <Badge 
                                  variant="outline" 
                                  className={cn(
                                    "mb-2",
                                    item.type === 'video' && "bg-red-50 text-red-700 border-red-200",
                                    item.type === 'post' && "bg-blue-50 text-blue-700 border-blue-200",
                                    item.type === 'carrossel' && "bg-amber-50 text-amber-700 border-amber-200",
                                    item.type === 'reels' && "bg-purple-50 text-purple-700 border-purple-200",
                                    item.type === 'story' && "bg-green-50 text-green-700 border-green-200"
                                  )}
                                >
                                  {item.type}
                                </Badge>
                                {item.deadline && (
                                  <div className="text-xs text-muted-foreground flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {new Date(item.deadline).toLocaleDateString('pt-BR')}
                                  </div>
                                )}
                              </div>

                              <h3 className="font-medium mb-2">{item.title}</h3>
                              
                              <div className="space-y-1.5 mt-3">
                                {item.subtasks.map((subtask) => (
                                  <div 
                                    key={subtask.id} 
                                    className="flex items-start"
                                    onClick={() => toggleSubtaskCompletion(item.id, subtask.id)}
                                  >
                                    <Checkbox 
                                      id={subtask.id} 
                                      checked={subtask.completed}
                                      className="mt-1"
                                    />
                                    <Label 
                                      htmlFor={subtask.id} 
                                      className={cn(
                                        "ml-2 text-sm cursor-pointer",
                                        subtask.completed && "line-through text-muted-foreground"
                                      )}
                                    >
                                      {subtask.text}
                                    </Label>
                                  </div>
                                ))}
                              </div>

                              <div className="flex justify-between items-center mt-4 pt-2 border-t">
                                <Button variant="ghost" size="sm" className="text-xs px-2">
                                  <FileText className="h-3.5 w-3.5 mr-1" />
                                  Detalhes
                                </Button>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="text-xs">
                                      Ações
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>{item.title}</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                      <Button className="w-full" variant="outline">
                                        Editar Conteúdo
                                      </Button>
                                      <Button className="w-full" variant="outline">
                                        Gerar Legenda com IA
                                      </Button>
                                      <Button className="w-full" variant="outline">
                                        Enviar para Agendamento
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
      
      {/* Distribution Dialog */}
      <Dialog open={showDistributionDialog} onOpenChange={setShowDistributionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Distribuir Conteúdo</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">Parabéns! Seu conteúdo foi publicado. Escolha as plataformas para distribuição:</p>
            
            <div className="space-y-3 mb-6">
              {distributionPlatforms.map(platform => (
                <div key={platform.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={platform.id} 
                    checked={selectedPlatforms[platform.id]} 
                    onCheckedChange={() => handlePlatformChange(platform.id)}
                  />
                  <Label htmlFor={platform.id} className="flex items-center">
                    <platform.icon className={cn("h-5 w-5 mr-2", platform.color)} />
                    {platform.name}
                  </Label>
                </div>
              ))}
            </div>
            
            {Object.entries(selectedPlatforms).some(([key, value]) => value) && (
              <div className="space-y-4">
                <h4 className="font-medium">Sugestões de adaptação</h4>
                
                {Object.entries(selectedPlatforms)
                  .filter(([_, isSelected]) => isSelected)
                  .map(([platform, _]) => (
                    <DistributionSuggestion 
                      key={platform} 
                      platform={distributionPlatforms.find(p => p.id === platform)!} 
                    />
                  ))
                }
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDistributionDialog(false)}>
              Ignorar
            </Button>
            <Button onClick={distributeContent}>
              Distribuir Conteúdo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KanbanBoard;
