
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentStrategyTable } from "@/components/content-strategy/ContentStrategyTable";
import { ContentStrategyFilters } from "@/components/content-strategy/ContentStrategyFilters";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ContentStrategyFilter, ContentStrategyItem } from "@/types/content-strategy";

interface ContentStrategyTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  items: ContentStrategyItem[];
  isLoading: boolean;
  equipments: { id: string; nome: string }[];
  users: { id: string; nome: string }[];
  filters: ContentStrategyFilter;
  onFilterChange: (filters: ContentStrategyFilter) => void;
  onUpdateItem: (id: string, updates: Partial<ContentStrategyItem>) => void;
  onDeleteItem: (id: string) => void;
  onGenerateContent: (item: ContentStrategyItem) => void;
  onScheduleContent: (item: ContentStrategyItem) => void;
}

const ContentStrategyTabs: React.FC<ContentStrategyTabsProps> = ({
  activeTab,
  setActiveTab,
  items,
  isLoading,
  equipments,
  users,
  filters,
  onFilterChange,
  onUpdateItem,
  onDeleteItem,
  onGenerateContent,
  onScheduleContent
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="lista">Lista de Conteúdo</TabsTrigger>
        <TabsTrigger value="filtros">Filtros Avançados</TabsTrigger>
      </TabsList>
      
      <TabsContent value="lista" className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-contourline-mediumBlue" />
              <p className="text-sm text-muted-foreground">Carregando dados...</p>
            </div>
          </div>
        ) : (
          <ContentStrategyTable
            data={items}
            equipments={equipments}
            users={users}
            onUpdate={onUpdateItem}
            onDelete={onDeleteItem}
            onGenerateContent={onGenerateContent}
            onSchedule={onScheduleContent}
          />
        )}
        
        {!isLoading && items.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Nenhum item de estratégia encontrado. Utilize os filtros para refinar sua busca ou adicione um novo item.
            </p>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="filtros">
        <div className="space-y-4">
          <ContentStrategyFilters
            onFilterChange={onFilterChange}
            equipments={equipments}
            users={users}
          />
          <Separator className="my-6" />
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {items.length} {items.length === 1 ? 'item encontrado' : 'itens encontrados'}
            </p>
            <Button 
              variant="default" 
              onClick={() => setActiveTab("lista")}
            >
              Visualizar resultados
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ContentStrategyTabs;
