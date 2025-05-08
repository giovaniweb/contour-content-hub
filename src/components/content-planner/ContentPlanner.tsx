
import React, { useState } from "react";
import { DropResult } from "@hello-pangea/dnd";
import { useContentPlanner } from "@/hooks/content-planner/useContentPlanner";
import { ContentPlannerItem, ContentPlannerFilter } from "@/types/content-planner";
import ContentPlannerHeader from "./ContentPlannerHeader";
import ContentPlannerFilters from "./ContentPlannerFilters";
import ContentPlannerColumns from "./ContentPlannerColumns";
import ContentPlannerDialog from "./ContentPlannerDialog";
import ContentPlannerScheduleDialog from "./ContentPlannerScheduleDialog";
import ContentPlannerDeleteDialog from "./ContentPlannerDeleteDialog";

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
      <ContentPlannerHeader
        onNewItem={handleNewItem}
        onGenerateSuggestions={handleGenerateSuggestions}
        isGeneratingSuggestions={isGeneratingSuggestions}
      />
      
      <ContentPlannerFilters 
        filters={filters} 
        onFilterChange={setFilters} 
      />
      
      <ContentPlannerColumns
        columns={columns}
        onEditItem={handleEditItem}
        onDeleteItem={handleDeleteClick}
        onScheduleItem={handleScheduleClick}
        onDragEnd={handleDragEnd}
      />
      
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
      <ContentPlannerDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        item={selectedItem}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default ContentPlanner;
