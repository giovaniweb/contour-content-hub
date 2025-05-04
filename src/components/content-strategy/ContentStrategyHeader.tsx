
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilterIcon, Calendar, Plus } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { usePermissions } from "@/hooks/use-permissions";

interface ContentStrategyHeaderProps {
  onShowFilters: () => void;
  canEdit: boolean;
}

const ContentStrategyHeader: React.FC<ContentStrategyHeaderProps> = ({ 
  onShowFilters, 
  canEdit 
}) => {
  return (
    <CardHeader>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle className="text-xl">Gestão Estratégica de Conteúdo</CardTitle>
          <CardDescription>
            Planeje, organize e execute sua estratégia de conteúdo
          </CardDescription>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={onShowFilters}
          >
            <FilterIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Filtros</span>
          </Button>
          
          {canEdit && (
            <Sheet>
              <SheetTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Novo Item</span>
                </Button>
              </SheetTrigger>
            </Sheet>
          )}
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => window.open('/calendar', '_self')}
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Ver Agenda</span>
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};

export default ContentStrategyHeader;
