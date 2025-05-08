
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FilterActionsProps {
  onClearFilters: () => void;
}

export const FilterActions: React.FC<FilterActionsProps> = ({ 
  onClearFilters 
}) => {
  return (
    <div className="flex justify-end">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onClearFilters}
      >
        <X className="mr-2 h-4 w-4" />
        Limpar Filtros
      </Button>
    </div>
  );
};
