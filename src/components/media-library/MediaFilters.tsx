import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, ArrowLeft, ArrowRight, X, LayoutGrid, LayoutList } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MediaFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  selectedEquipment: string;
  setSelectedEquipment: (value: string) => void;
  selectedBodyArea: string;
  setSelectedBodyArea: (value: string) => void;
  selectedPurpose: string;
  setSelectedPurpose: (value: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (value: "grid" | "list") => void;
  handleReset: () => void;
}

const MediaFilters: React.FC<MediaFiltersProps> = ({
  search,
  setSearch,
  selectedEquipment,
  setSelectedEquipment,
  selectedBodyArea,
  setSelectedBodyArea,
  selectedPurpose,
  setSelectedPurpose,
  viewMode,
  setViewMode,
  handleReset
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const hasActiveFilters = search || selectedEquipment !== "" || selectedBodyArea !== "" || selectedPurpose !== "";
  
  // Equipment, body area, and purpose options based on the updated database schema
  const equipmentOptions = [
    "Adélla Laser",
    "Enygma X-Orbital",
    "Focuskin",
    "Hipro",
    "Hive Pro",
    "Laser Crystal 3D Plus",
    "MultiShape",
    "Reverso",
    "Supreme Pro",
    "Ultralift - Endolaser",
    "Unyque PRO",
    "X-Tonus"
  ];
  
  const bodyAreaOptions = [
    "Face", 
    "Pescoço", 
    "Abdômen", 
    "Coxas", 
    "Glúteos", 
    "Braços",
    "Corpo todo"
  ];
  
  const purposeOptions = [
    "Rugas",
    "Emagrecimento", 
    "Tonificação", 
    "Hidratação", 
    "Flacidez",
    "Gordura localizada",
    "Lipedema",
    "Sarcopenia"
  ];

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            Mídias
            {hasActiveFilters && (
              <Badge variant="outline" className="ml-2">Filtros ativos</Badge>
            )}
          </h3>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Anterior</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Próximo</TooltipContent>
            </Tooltip>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar mídia..."
              className="pl-10 pr-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setSearch('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <ToggleGroup 
              type="single" 
              value={viewMode} 
              onValueChange={(value) => value && setViewMode(value as "grid" | "list")}
              className="border rounded-md"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="grid" aria-label="Ver em grid">
                    <LayoutGrid className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Ver em grid</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="list" aria-label="Ver em lista">
                    <LayoutList className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Ver em lista</TooltipContent>
              </Tooltip>
            </ToggleGroup>
          
            <Button 
              variant={showAdvancedFilters ? "secondary" : "outline"} 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="whitespace-nowrap"
              size="sm"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showAdvancedFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
            </Button>
            
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="whitespace-nowrap"
                size="sm"
              >
                Limpar Filtros
              </Button>
            )}
          </div>
        </div>
        
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg animate-in fade-in duration-150">
            <div>
              <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                <SelectTrigger>
                  <SelectValue placeholder="Equipamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os Equipamentos</SelectItem>
                  {equipmentOptions.map((equipment) => (
                    <SelectItem key={equipment} value={equipment}>
                      {equipment}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={selectedBodyArea} onValueChange={setSelectedBodyArea}>
                <SelectTrigger>
                  <SelectValue placeholder="Área do Corpo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as Áreas</SelectItem>
                  {bodyAreaOptions.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={selectedPurpose} onValueChange={setSelectedPurpose}>
                <SelectTrigger>
                  <SelectValue placeholder="Finalidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as Finalidades</SelectItem>
                  {purposeOptions.map((purpose) => (
                    <SelectItem key={purpose} value={purpose}>
                      {purpose}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default MediaFilters;
