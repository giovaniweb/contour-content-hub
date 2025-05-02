
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { 
  AlertCircle, Calendar as CalendarIcon, Check, RefreshCcw, Settings
} from "lucide-react";
import CalendarDay from "@/components/CalendarDay";
import CalendarSettings from "@/components/CalendarSettings";
import { useToast } from "@/hooks/use-toast";
import { getCalendarSuggestions, CalendarSuggestion, clearPlanning, approvePlanning, setCalendarPreferences } from "@/utils/api";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const CalendarPage: React.FC = () => {
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [suggestions, setSuggestions] = useState<CalendarSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);
  const [isConfirmApproveOpen, setIsConfirmApproveOpen] = useState(false);

  useEffect(() => {
    loadCalendarSuggestions();
  }, [currentMonth, currentYear]);
  
  const loadCalendarSuggestions = async () => {
    try {
      setIsLoading(true);
      const data = await getCalendarSuggestions();
      setSuggestions(data);
    } catch (error) {
      console.error("Erro ao buscar sugestões do calendário:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar as sugestões para o calendário.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClearPlanning = async () => {
    try {
      await clearPlanning();
      setSuggestions([]);
      setIsConfirmClearOpen(false);
      toast({
        title: "Planejamento limpo",
        description: "Todas as sugestões foram removidas.",
      });
    } catch (error) {
      console.error("Erro ao limpar planejamento:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível limpar o planejamento.",
      });
    }
  };
  
  const handleApprovePlanning = async () => {
    try {
      await approvePlanning();
      setIsConfirmApproveOpen(false);
      toast({
        title: "Planejamento aprovado",
        description: "Suas sugestões foram salvas na agenda.",
      });
    } catch (error) {
      console.error("Erro ao aprovar planejamento:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível aprovar o planejamento.",
      });
    }
  };
  
  const handleSaveSettings = async (preferences: any) => {
    try {
      await setCalendarPreferences(preferences);
      setIsSettingsOpen(false);
      loadCalendarSuggestions();
      toast({
        title: "Preferências salvas",
        description: "Suas preferências foram atualizadas.",
      });
    } catch (error) {
      console.error("Erro ao salvar preferências:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar suas preferências.",
      });
    }
  };
  
  const getEventsForDate = (date: Date): CalendarSuggestion[] => {
    return suggestions.filter(sugg => {
      const suggDate = new Date(sugg.date);
      return isSameDay(suggDate, date);
    });
  };
  
  const hasEvents = (date: Date) => {
    return suggestions.some(sugg => isSameDay(new Date(sugg.date), date));
  };
  
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  const hasSelectedDateEvents = selectedDate ? hasEvents(selectedDate) : false;
  
  return (
    <Layout title="Agenda Criativa">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Agenda Criativa</h1>
            <p className="text-muted-foreground">
              Organize e planeje seu conteúdo para redes sociais
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button
              variant="outline" 
              size="sm"
              onClick={() => loadCalendarSuggestions()}
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Configurar
            </Button>
          </div>
        </div>
        
        <div className="border rounded-lg">
          <Tabs defaultValue="month" className="w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b px-4 py-2">
              <TabsList className="mb-2 sm:mb-0">
                <TabsTrigger value="month">Mês</TabsTrigger>
                <TabsTrigger value="week">Semana</TabsTrigger>
                <TabsTrigger value="plan">Planejamento</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsConfirmClearOpen(true)}
                >
                  Limpar
                </Button>
                <Button 
                  size="sm"
                  onClick={() => setIsConfirmApproveOpen(true)}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Aprovar
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row">
              {/* Calendário para selecionar data */}
              <div className="p-4 border-b lg:border-b-0 lg:border-r lg:w-1/2">
                <div className="flex items-center justify-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  <h2 className="text-lg font-medium">
                    {format(new Date(currentYear, currentMonth), 'MMMM yyyy', { locale: ptBR })}
                  </h2>
                </div>
                
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  month={new Date(currentYear, currentMonth)}
                  onMonthChange={(date) => {
                    setCurrentMonth(date.getMonth());
                    setCurrentYear(date.getFullYear());
                  }}
                  className="w-full mt-4"
                  locale={ptBR}
                  modifiers={{
                    hasEvent: (date) => hasEvents(date)
                  }}
                  modifiersClassNames={{
                    hasEvent: 'bg-blue-100 font-bold text-blue-600 hover:bg-blue-200'
                  }}
                  showOutsideDays={false}
                />
              </div>
              
              {/* Detalhes do dia selecionado */}
              <div className="p-4 lg:w-1/2">
                <div className="flex items-center mb-4">
                  <h2 className="text-lg font-medium">
                    {selectedDate 
                      ? format(selectedDate, 'EEEE, dd MMMM yyyy', { locale: ptBR })
                      : "Selecione uma data"
                    }
                  </h2>
                </div>
                
                {isLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    {selectedDate && (
                      <>
                        {hasSelectedDateEvents ? (
                          <div className="space-y-4">
                            {selectedDateEvents.map((event, idx) => (
                              <CalendarDay 
                                key={`${event.date}-${idx}`}
                                event={event}
                                onRefresh={loadCalendarSuggestions}
                              />
                            ))}
                          </div>
                        ) : (
                          <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Nenhum conteúdo planejado</AlertTitle>
                            <AlertDescription>
                              Não há sugestões de conteúdo para esta data.
                            </AlertDescription>
                          </Alert>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </Tabs>
        </div>
      </div>
      
      {/* Diálogo de configurações */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Configurações da Agenda Criativa</DialogTitle>
            <DialogDescription>
              Personalize como suas sugestões de conteúdo são geradas
            </DialogDescription>
          </DialogHeader>
          
          <CalendarSettings onSave={handleSaveSettings} onCancel={() => setIsSettingsOpen(false)} />
        </DialogContent>
      </Dialog>
      
      {/* Diálogos de confirmação */}
      <Dialog open={isConfirmClearOpen} onOpenChange={setIsConfirmClearOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Limpar Planejamento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja limpar todo o planejamento do mês atual?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsConfirmClearOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleClearPlanning}>
              Limpar Planejamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isConfirmApproveOpen} onOpenChange={setIsConfirmApproveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprovar Planejamento</DialogTitle>
            <DialogDescription>
              Ao aprovar o planejamento, todas as sugestões serão salvas na sua agenda
              e você receberá lembretes sobre as publicações programadas.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsConfirmApproveOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleApprovePlanning}>
              <Check className="h-4 w-4 mr-1" />
              Aprovar Planejamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default CalendarPage;
