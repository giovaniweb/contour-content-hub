
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import {
  fetchContentStrategyItems,
  createContentStrategyItem,
  updateContentStrategyItem,
  deleteContentStrategyItem,
  generateContentWithAI,
  scheduleContentInCalendar,
} from "@/services/contentStrategyService";
import { ContentStrategyFilters } from "@/components/content-strategy/ContentStrategyFilters";
import { ContentStrategyTable } from "@/components/content-strategy/ContentStrategyTable";
import ContentStrategyForm from "@/components/content-strategy/ContentStrategyForm";
import { ContentStrategyFilter, ContentStrategyItem } from "@/types/content-strategy";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { FilterIcon, Calendar, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { usePermissions } from "@/hooks/use-permissions";

const ContentStrategy: React.FC = () => {
  const [items, setItems] = useState<ContentStrategyItem[]>([]);
  const [filters, setFilters] = useState<ContentStrategyFilter>({});
  const [equipments, setEquipments] = useState<{ id: string; nome: string }[]>([]);
  const [users, setUsers] = useState<{ id: string; nome: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAdmin, isOperator } = usePermissions();
  const [activeTab, setActiveTab] = useState("lista");
  
  // Fetch data on component mount
  useEffect(() => {
    fetchData();
    fetchEquipments();
    fetchUsers();
  }, []);

  // Fetch data with filters when filters change
  useEffect(() => {
    fetchData(filters);
  }, [filters]);

  const fetchData = async (currentFilters: ContentStrategyFilter = filters) => {
    setIsLoading(true);
    try {
      const data = await fetchContentStrategyItems(currentFilters);
      setItems(data);
    } catch (error) {
      console.error("Error fetching content strategy items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEquipments = async () => {
    try {
      const { data, error } = await supabase
        .from("equipamentos")
        .select("id, nome")
        .eq("ativo", true)
        .order("nome", { ascending: true });

      if (error) throw error;
      setEquipments(data || []);
    } catch (error) {
      console.error("Error fetching equipments:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar equipamentos",
        description: "Não foi possível obter a lista de equipamentos.",
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("perfis")
        .select("id, nome")
        .order("nome", { ascending: true });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar usuários",
        description: "Não foi possível obter a lista de usuários.",
      });
    }
  };

  const handleFilterChange = (newFilters: ContentStrategyFilter) => {
    setFilters(newFilters);
  };

  const handleCreateItem = async (item: Partial<ContentStrategyItem>) => {
    setIsSubmitting(true);
    try {
      const newItem = await createContentStrategyItem(item);
      if (newItem) {
        setItems(prev => [newItem, ...prev]);
      }
    } catch (error) {
      console.error("Error creating item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateItem = async (id: string, updates: Partial<ContentStrategyItem>) => {
    try {
      const success = await updateContentStrategyItem(id, updates);
      if (success) {
        setItems(prev =>
          prev.map(item => (item.id === id ? { ...item, ...updates } : item))
        );
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const success = await deleteContentStrategyItem(id);
      if (success) {
        setItems(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleGenerateContent = async (item: ContentStrategyItem) => {
    try {
      const content = await generateContentWithAI(item);
      if (content) {
        await handleUpdateItem(item.id, { conteudo: content });
      }
    } catch (error) {
      console.error("Error generating content:", error);
    }
  };

  const handleScheduleContent = async (item: ContentStrategyItem) => {
    try {
      await scheduleContentInCalendar(item);
    } catch (error) {
      console.error("Error scheduling content:", error);
    }
  };

  const canEdit = isAdmin() || isOperator();

  return (
    <Layout title="Gestão Estratégica de Conteúdo">
      <Card>
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
                onClick={() => setActiveTab("filtros")}
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
                  <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Adicionar item à estratégia</SheetTitle>
                      <SheetDescription>
                        Preencha as informações para adicionar um novo item à sua estratégia de conteúdo.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-6">
                      <ContentStrategyForm 
                        equipamentos={equipments}
                        responsaveis={users}
                        onSave={handleCreateItem}
                        onClose={() => {
                          const sheetCloseButton = document.querySelector('.sheet-close-button') as HTMLButtonElement;
                          if (sheetCloseButton) sheetCloseButton.click();
                        }}
                      />
                    </div>
                    <SheetFooter>
                      <SheetClose asChild className="sheet-close-button">
                        <Button type="button" variant="outline">Cancelar</Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
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
        <CardContent>
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
                  onUpdate={handleUpdateItem}
                  onDelete={handleDeleteItem}
                  onGenerateContent={handleGenerateContent}
                  onSchedule={handleScheduleContent}
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
                  onFilterChange={handleFilterChange}
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
        </CardContent>
      </Card>
    </Layout>
  );
};

export default ContentStrategy;
