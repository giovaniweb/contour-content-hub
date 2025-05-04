
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Plus } from "lucide-react";

interface ContentStrategyHeaderProps {
  onShowFilters: () => void;
  onNewItem: () => void;
  canEdit: boolean;
}

const ContentStrategyHeader: React.FC<ContentStrategyHeaderProps> = ({
  onShowFilters,
  onNewItem,
  canEdit
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>Estratégia de Conteúdo</CardTitle>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onShowFilters}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
        
        {canEdit && (
          <Button 
            size="sm" 
            onClick={onNewItem}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Item
          </Button>
        )}
      </div>
    </CardHeader>
  );
};

export default ContentStrategyHeader;
