
import React, { useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import ContentPlannerCard from "./ContentPlannerCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddContentPlannerItemForm from "./AddContentPlannerItemForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useContentPlanner } from "@/hooks/useContentPlanner";
import { ContentPlannerItem } from "@/types/content-planner";

interface KanbanColumnProps {
  title: string;
  items: ContentPlannerItem[];
  columnId: string;
  onEdit: (item: ContentPlannerItem) => void;
  onDelete: (id: string) => void;
  onGenerateScript?: (item: ContentPlannerItem) => void;
  onValidate?: (item: ContentPlannerItem) => void;
  onSchedule?: (item: ContentPlannerItem) => void;
  onViewDetails?: (item: ContentPlannerItem) => void;
}

interface KanbanBoardProps {
  onViewDetails?: (item: ContentPlannerItem) => void;
  onGenerateScript?: (item: ContentPlannerItem) => void;
  onValidate?: (item: ContentPlannerItem) => void;
}

// KanbanColumn component
const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  items,
  columnId,
  onEdit,
  onDelete,
  onGenerateScript,
  onValidate,
  onSchedule,
  onViewDetails
}) => {
  return (
    <div className="flex-1 min-w-[280px] max-w-full">
      <div className="bg-muted/50 rounded-lg p-4 h-full flex flex-col min-h-[600px]">
        <h3 className="font-medium text-sm mb-4 text-muted-foreground">{title} ({items.length})</h3>
        
        <Droppable droppableId={columnId}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex-1"
            >
              {items.map((item, index) => (
                <ContentPlannerCard
                  key={item.id}
                  item={item}
                  index={index}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onGenerateScript={onGenerateScript}
                  onValidate={onValidate}
                  onSchedule={onSchedule}
                  onViewDetails={onViewDetails}
                />
              ))}
              {provided.placeholder}
              
              {/* Space at the bottom to allow dropping when column is empty */}
              {items.length === 0 && (
                <div className="h-20 border-2 border-dashed border-muted rounded-md flex items-center justify-center text-muted-foreground text-sm">
                  Arraste itens para cá
                </div>
              )}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

// Main KanbanBoard component
const KanbanBoard: React.FC<KanbanBoardProps> = ({ 
  onViewDetails, 
  onGenerateScript, 
  onValidate 
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { columns, items, moveItem, updateItem, removeItem, addItem } = useContentPlanner();
  
  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    
    // Dropped outside the list
    if (!destination) return;
    
    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    // Find the item being dragged
    const item = items.find(item => item.id === draggableId);
    if (!item) return;
    
    // Update the status based on the destination column
    moveItem(draggableId, destination.droppableId as any);
  };
  
  const handleEditItem = (item: ContentPlannerItem) => {
    updateItem(item.id, item);
  };
  
  const handleDeleteItem = (id: string) => {
    removeItem(id);
  };
  
  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Conteúdo
        </Button>
      </div>
      
      <div className="relative overflow-x-auto pb-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex space-x-4 min-w-max">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                title={column.title}
                items={items.filter(item => item.status === column.id)}
                columnId={column.id}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                onGenerateScript={onGenerateScript}
                onValidate={onValidate}
                onSchedule={(item) => {
                  // Update status to scheduled
                  updateItem(item.id, {
                    ...item,
                    status: "scheduled",
                    scheduledDate: new Date().toISOString()
                  });
                }}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Conteúdo</DialogTitle>
          </DialogHeader>
          
          <AddContentPlannerItemForm
            onSubmit={(data) => {
              addItem({
                ...data,
                id: `item-${Date.now()}`,
                status: "idea",
                aiGenerated: false
              });
              setIsAddDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default KanbanBoard;
