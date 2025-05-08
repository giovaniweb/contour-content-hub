
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

interface FilterHeaderProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export const FilterHeader: React.FC<FilterHeaderProps> = ({
  hasActiveFilters,
  onClearFilters,
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium flex items-center">
        <Filter className="h-4 w-4 mr-2" />
        Filtros
      </h3>
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="h-7 text-xs"
        >
          <X className="h-3 w-3 mr-1" />
          Limpar filtros
        </Button>
      )}
    </div>
  );
};
