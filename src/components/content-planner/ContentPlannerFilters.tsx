import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ContentPlannerFilter } from "@/types/content-planner";
import { useEquipments } from "@/hooks/useEquipments";
import { CalendarIcon, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentPlannerFiltersProps {
  filters: ContentPlannerFilter;
  onFilterChange: (filters: ContentPlannerFilter) => void;
}

const ContentPlannerFilters: React.FC<ContentPlannerFiltersProps> = ({
  filters,
  onFilterChange
}) => {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: filters.dateRange?.from,
    to: filters.dateRange?.to
  });
  const { equipments } = useEquipments();
  
  const handleFilterChange = (key: keyof ContentPlannerFilter, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };
  
  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range);
    onFilterChange({
      ...filters,
      dateRange: range
    });
  };
  
  const clearFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    onFilterChange({});
  };
  
  const hasActiveFilters = (): boolean => {
    return Boolean(
      filters.objective ||
      filters.format ||
      filters.distribution ||
      filters.equipmentId ||
      filters.dateRange?.from ||
      filters.dateRange?.to
    );
  };
  
  return (
    <div className="bg-muted/20 p-4 rounded-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </h3>
        {hasActiveFilters() && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-7 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Limpar filtros
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Format filter */}
        <div>
          <Select
            value={filters.format || ""}
            onValueChange={(value) => handleFilterChange('format', value || undefined)}
          >
            <SelectTrigger className="w-full text-sm h-9">
              <SelectValue placeholder="Formato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os formatos</SelectItem>
              <SelectItem value="vídeo">Vídeo</SelectItem>
              <SelectItem value="story">Story</SelectItem>
              <SelectItem value="carrossel">Carrossel</SelectItem>
              <SelectItem value="reels">Reels</SelectItem>
              <SelectItem value="texto">Texto</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Objective filter */}
        <div>
          <Select
            value={filters.objective || ""}
            onValueChange={(value) => handleFilterChange('objective', value || undefined)}
          >
            <SelectTrigger className="w-full text-sm h-9">
              <SelectValue placeholder="Objetivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os objetivos</SelectItem>
              <SelectItem value="🟡 Atrair Atenção">Atrair Atenção</SelectItem>
              <SelectItem value="🟢 Criar Conexão">Criar Conexão</SelectItem>
              <SelectItem value="🔴 Fazer Comprar">Fazer Comprar</SelectItem>
              <SelectItem value="🔁 Reativar Interesse">Reativar Interesse</SelectItem>
              <SelectItem value="✅ Fechar Agora">Fechar Agora</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Distribution filter */}
        <div>
          <Select
            value={filters.distribution || ""}
            onValueChange={(value) => handleFilterChange('distribution', value || undefined)}
          >
            <SelectTrigger className="w-full text-sm h-9">
              <SelectValue placeholder="Canal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os canais</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="YouTube">YouTube</SelectItem>
              <SelectItem value="TikTok">TikTok</SelectItem>
              <SelectItem value="Blog">Blog</SelectItem>
              <SelectItem value="Múltiplos">Múltiplos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Equipment filter */}
        <div>
          <Select
            value={filters.equipmentId || ""}
            onValueChange={(value) => handleFilterChange('equipmentId', value || undefined)}
          >
            <SelectTrigger className="w-full text-sm h-9">
              <SelectValue placeholder="Equipamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os equipamentos</SelectItem>
              {equipments.map((equipment) => (
                <SelectItem key={equipment.id} value={equipment.id}>
                  {equipment.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Date range filter */}
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left text-sm h-9 font-normal",
                  !dateRange.from && !dateRange.to && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                      {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                  )
                ) : (
                  "Data de publicação"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={handleDateRangeChange}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default ContentPlannerFilters;
