
import React, { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useContentPlanner } from "@/hooks/useContentPlanner";
import ContentPlannerColumn from "./ContentPlannerColumn";
import ContentPlannerFilters from "./ContentPlannerFilters";
import ContentPlannerDialog from "./ContentPlannerDialog";
import ContentPlannerScheduleDialog from "./ContentPlannerScheduleDialog";
import { Button } from "@/components/ui/button";
import { ContentPlannerItem, ContentPlannerFilter } from "@/types/content-planner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, CalendarClock, CalendarCheck, Sparkles } from "lucide-react";

const ContentPlanner: React.FC = () => {
  const {
    columns,
    filters,
    setFilters,
    loading,
    addItem,
    updateItem,
    removeItem,
    moveItem,
    generateSuggestions
  } = useContentPlanner();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentPlannerItem | undefined>();
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  
  // Handle opening the dialog for creating a new item
  const handleNewItem = () => {
    setSelectedItem(undefined);
    setIsDialogOpen(true);
  };
  
  // Handle opening the dialog for editing an existing item
  const handleEditItem = (item: ContentPlannerItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };
  
  // Handle opening the delete confirmation dialog
  const handleDeleteClick = (id: string) => {
    const item = columns.flatMap(col => col.items).find(item => item.id === id);
    if (item) {
      setSelectedItem(item);
      setIsDeleteDialogOpen(true);
    }
  };
  
  // Handle confirming deletion
  const handleConfirmDelete = async () => {
    if (selectedItem) {
      await removeItem(selectedItem.id);
      setIsDeleteDialogOpen(false);
    }
  };
  
  // Handle scheduling an item
  const handleScheduleClick = (item: ContentPlannerItem) => {
    setSelectedItem(item);
    setIsScheduleDialogOpen(true);
  };
  
  const handleSchedule = async (item: ContentPlannerItem, date: Date) => {
    await updateItem(item.id, {
      status: 'scheduled',
      scheduledDate: date.toISOString().split('T')[0]
    });
  };
  
  // Handle saving an item (create or update)
  const handleSaveItem = async (item: Partial<ContentPlannerItem>) => {
    if (selectedItem) {
      // Update existing item
      await updateItem(selectedItem.id, item);
    } else {
      // Create new item
      await addItem({
        ...item,
        status: 'idea',
        aiGenerated: false
      });
    }
  };
  
  // Handle generating AI suggestions
  const handleGenerateSuggestions = async () => {
    setIsGeneratingSuggestions(true);
    try {
      await generateSuggestions(3, filters.objective, filters.format);
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };
  
  // Handle drag and drop
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    // Dropped outside the list or in the same position
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
    
    // If it's a different column, update the item's status
    if (destination.droppableId !== source.droppableId) {
      moveItem(draggableId, destination.droppableId as any);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Planejador de Conteúdo</h1>
          <p className="text-muted-foreground">
            Organize seu plano de marketing de forma visual e estratégica
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleGenerateSuggestions}
            disabled={isGeneratingSuggestions}
            className="flex items-center"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isGeneratingSuggestions ? "Gerando..." : "Gerar Sugestões"}
          </Button>
          <Button onClick={handleNewItem} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Novo Conteúdo
          </Button>
        </div>
      </div>
      
      <ContentPlannerFilters 
        filters={filters} 
        onFilterChange={setFilters} 
      />
      
      <div className="mt-6 flex-1 overflow-x-auto pb-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4">
            {columns.map(column => (
              <ContentPlannerColumn
                key={column.id}
                column={column}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteClick}
                onGenerateScript={() => {}} // TODO: Implement script generation
                onValidateScript={() => {}} // TODO: Implement script validation
                onScheduleItem={handleScheduleClick}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
      
      {/* Dialog for creating/editing items */}
      <ContentPlannerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={selectedItem}
        onSave={handleSaveItem}
      />
      
      {/* Dialog for scheduling */}
      {selectedItem && (
        <ContentPlannerScheduleDialog
          open={isScheduleDialogOpen}
          onOpenChange={setIsScheduleDialogOpen}
          item={selectedItem}
          onSchedule={handleSchedule}
        />
      )}
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Item</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o item "{selectedItem?.title}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContentPlanner;
