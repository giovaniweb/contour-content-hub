
import React from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useContentPlanner } from '@/hooks/useContentPlanner';
import ContentPlannerColumn from './ContentPlannerColumn';
import { ContentPlannerItem, ContentPlannerStatus } from '@/types/content-planner';
import { toast } from 'sonner';

interface KanbanBoardProps {
  onViewDetails: (item: ContentPlannerItem) => void;
  onGenerateScript: (item: ContentPlannerItem) => void;
  onValidate: (item: ContentPlannerItem) => void;
  searchQuery?: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  onViewDetails,
  onGenerateScript,
  onValidate,
  searchQuery = ''
}) => {
  const { columns, moveItem, addItem, removeItem } = useContentPlanner();

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    // Se não mudou de lugar, não faz nada
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const targetStatus = destination.droppableId as ContentPlannerStatus;
    
    try {
      await moveItem(draggableId, targetStatus);
      
      toast.success("🚀 Item movido com sucesso!", {
        description: `Status alterado para ${getStatusLabel(targetStatus)}`
      });
    } catch (error) {
      toast.error("❌ Erro ao mover item", {
        description: "Não foi possível alterar o status do item"
      });
    }
  };

  const getStatusLabel = (status: ContentPlannerStatus): string => {
    const labels = {
      'idea': 'Ideias',
      'script_generated': 'Roteiro Gerado',
      'approved': 'Aprovado',
      'scheduled': 'Agendado',
      'published': 'Publicado'
    };
    return labels[status] || status;
  };

  const handleEditItem = (item: ContentPlannerItem) => {
    onViewDetails(item);
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await removeItem(id);
      toast.success("🗑️ Item removido!", {
        description: "Item removido do planejador"
      });
    } catch (error) {
      toast.error("❌ Erro ao remover", {
        description: "Não foi possível remover o item"
      });
    }
  };

  const handleScheduleItem = (item: ContentPlannerItem) => {
    // Mover para status "scheduled"
    moveItem(item.id, 'scheduled');
  };

  // Filtrar colunas baseado na busca
  const filteredColumns = columns.map(column => ({
    ...column,
    items: column.items.filter(item => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    })
  }));

  return (
    <div className="h-full overflow-x-auto">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 min-w-max pb-6">
          {filteredColumns.map(column => (
            <ContentPlannerColumn
              key={column.id}
              column={column}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              onGenerateScript={onGenerateScript}
              onValidateScript={onValidate}
              onScheduleItem={handleScheduleItem}
            />
          ))}
        </div>
      </DragDropContext>
      
      {searchQuery && filteredColumns.every(col => col.items.length === 0) && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum item encontrado
          </h3>
          <p className="text-gray-500 max-w-md">
            Não encontramos nenhum item que corresponda à sua busca "{searchQuery}". 
            Tente usar outros termos ou limpe o filtro.
          </p>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
