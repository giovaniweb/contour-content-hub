
import { useState } from 'react';
import { toast } from 'sonner';
import { ContentPlannerItem, ContentPlannerStatus, ContentPlannerColumn } from '@/types/content-planner';

export function useItemOperations(columns: ContentPlannerColumn[], setColumns: React.Dispatch<React.SetStateAction<ContentPlannerColumn[]>>) {
  // Add item to a column
  const addItem = async (item: Partial<ContentPlannerItem>): Promise<ContentPlannerItem | null> => {
    try {
      const newItem: ContentPlannerItem = {
        id: `item-${Date.now()}`,
        title: item.title || '',
        description: item.description || '',
        status: item.status || 'idea',
        tags: item.tags || [],
        format: item.format || 'vídeo',
        objective: item.objective || '🟡 Atrair Atenção',
        distribution: item.distribution || 'Instagram',
        equipmentId: item.equipmentId,
        equipmentName: item.equipmentName,
        authorId: 'currentUser', // Would be replaced with actual user ID
        authorName: 'Current User', // Would be replaced with actual user name
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        aiGenerated: item.aiGenerated || false
      };

      setColumns(prev => 
        prev.map(column => 
          column.id === newItem.status
            ? { ...column, items: [...column.items, newItem] }
            : column
        )
      );

      toast.success('Item adicionado com sucesso!');
      return newItem;
    } catch (error) {
      toast.error('Erro ao adicionar item');
      console.error('Error adding item:', error);
      return null;
    }
  };

  // Update an item
  const updateItem = async (id: string, updates: Partial<ContentPlannerItem>): Promise<ContentPlannerItem | null> => {
    try {
      let updatedItem: ContentPlannerItem | null = null;

      setColumns(prev => 
        prev.map(column => ({
          ...column,
          items: column.items.map(item => {
            if (item.id === id) {
              updatedItem = { ...item, ...updates, updatedAt: new Date().toISOString() };
              return updatedItem;
            }
            return item;
          })
        }))
      );

      if (updatedItem) {
        toast.success('Item atualizado com sucesso!');
        return updatedItem;
      } else {
        throw new Error('Item não encontrado');
      }
    } catch (error) {
      toast.error('Erro ao atualizar item');
      console.error('Error updating item:', error);
      return null;
    }
  };

  // Remove an item
  const removeItem = async (id: string): Promise<void> => {
    try {
      setColumns(prev => 
        prev.map(column => ({
          ...column,
          items: column.items.filter(item => item.id !== id)
        }))
      );

      toast.success('Item removido com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover item');
      console.error('Error removing item:', error);
    }
  };

  // Move an item between columns
  const moveItem = async (id: string, destinationStatus: ContentPlannerStatus): Promise<ContentPlannerItem | null> => {
    try {
      let itemToMove: ContentPlannerItem | null = null;
      let sourceColumnId: ContentPlannerStatus | null = null;

      // Find the item and its source column
      columns.forEach(column => {
        const found = column.items.find(item => item.id === id);
        if (found) {
          itemToMove = found;
          sourceColumnId = column.id;
        }
      });

      if (!itemToMove || !sourceColumnId) {
        throw new Error('Item não encontrado');
      }

      // Create updated item with new status
      const updatedItem = {
        ...itemToMove,
        status: destinationStatus,
        updatedAt: new Date().toISOString()
      };

      // Update columns state
      setColumns(prev => 
        prev.map(column => {
          if (column.id === sourceColumnId) {
            // Remove from source column
            return {
              ...column,
              items: column.items.filter(item => item.id !== id)
            };
          }
          if (column.id === destinationStatus) {
            // Add to destination column
            return {
              ...column,
              items: [...column.items, updatedItem]
            };
          }
          return column;
        })
      );

      toast.success('Item movido com sucesso!');
      return updatedItem;
    } catch (error) {
      toast.error('Erro ao mover item');
      console.error('Error moving item:', error);
      return null;
    }
  };

  return {
    addItem,
    updateItem,
    removeItem,
    moveItem
  };
}
