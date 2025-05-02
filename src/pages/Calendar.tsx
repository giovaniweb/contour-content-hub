
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getCalendarSuggestions, CalendarSuggestion, clearPlanning, approvePlanning, setCalendarPreferences } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import CalendarDay from "@/components/CalendarDay";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, LoaderIcon, Mail, Bell, Check, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const DAYS_OF_WEEK = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const Calendar: React.FC = () => {
  const { toast } = useToast();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [frequency, setFrequency] = useState<1 | 2 | 3>(2);
  const [observations, setObservations] = useState("");
  const [suggestions, setSuggestions] = useState<CalendarSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [emailAlertOpen, setEmailAlertOpen] = useState(false);
  const [emailFrequency, setEmailFrequency] = useState<"daily" | "weekly" | "intelligent">("weekly");
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [selectedEquipment, setSelectedEquipment] = useState<string>("");
  const [contentTypes, setContentTypes] = useState({
    video: true,
    story: true,
    image: true,
  });
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [confirmApproveOpen, setConfirmApproveOpen] = useState(false);
  
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Fetch calendar suggestions
  useEffect(() => {
    fetchCalendarSuggestions();
  }, [currentMonth, currentYear, frequency, selectedEquipment, contentTypes]);
  
  const fetchCalendarSuggestions = async () => {
    try {
      setIsLoading(true);
      const preferences = {
        equipment: selectedEquipment || undefined,
        contentTypes,
        frequency
      };
      const data = await getCalendarSuggestions(currentMonth, currentYear, preferences);
      setSuggestions(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Falha ao carregar calendário",
        description: "Não foi possível carregar as sugestões do calendário",
      });
      console.error("Failed to fetch calendar suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate calendar days for current month view
  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();
    
    const calendarDays = [];
    
    // Previous month's days
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - 1, prevMonthLastDay - i);
      calendarDays.push({ date, isCurrentMonth: false });
    }
    
    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateString = date.toISOString().split("T")[0];
      const suggestion = suggestions.find(s => s.date === dateString);
      calendarDays.push({ date, isCurrentMonth: true, suggestion });
    }
    
    // Next month's days
    const remainingDays = 7 - (calendarDays.length % 7);
    if (remainingDays < 7) {
      for (let day = 1; day <= remainingDays; day++) {
        const date = new Date(currentYear, currentMonth + 1, day);
        calendarDays.push({ date, isCurrentMonth: false });
      }
    }
    
    return calendarDays;
  };
  
  // Handle month navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  // Handle updating observations
  const handleSaveObservations = () => {
    // In a real app, this would call an API to save the observations
    toast({
      title: "Preferências salvas",
      description: "Suas preferências de conteúdo foram atualizadas",
    });
    
    // Reload calendar suggestions to reflect the new preferences
    fetchCalendarSuggestions();
  };
  
  // Handle updating email preferences
  const handleSaveEmailPreferences = () => {
    // In a real app, this would call an API to save the email preferences
    setEmailAlertOpen(false);
    
    toast({
      title: "Alertas de email configurados",
      description: `Você receberá alertas ${emailEnabled ? "" : "não"} ${
        emailFrequency === "daily" ? "diários" : 
        emailFrequency === "weekly" ? "semanais" : 
        "personalizados"
      }`,
    });
  };

  // Handle clearing the planning
  const handleClearPlanning = async () => {
    try {
      setIsLoading(true);
      await clearPlanning(currentMonth, currentYear);
      setConfirmClearOpen(false);
      toast({
        title: "Planejamento limpo",
        description: "O planejamento do mês foi limpo com sucesso",
      });
      await fetchCalendarSuggestions();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Falha ao limpar planejamento",
        description: "Não foi possível limpar o planejamento",
      });
      console.error("Failed to clear planning:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle approving the planning
  const handleApprovePlanning = async () => {
    try {
      setIsLoading(true);
      await approvePlanning(currentMonth, currentYear, suggestions);
      setConfirmApproveOpen(false);
      toast({
        title: "Planejamento aprovado",
        description: "O planejamento do mês foi aprovado com sucesso",
      });
      await fetchCalendarSuggestions();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Falha ao aprovar planejamento",
        description: "Não foi possível aprovar o planejamento",
      });
      console.error("Failed to approve planning:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format the month and year
  const formatMonthYear = () => {
    return new Intl.DateTimeFormat("pt-BR", {
      month: "long",
      year: "numeric",
    }).format(currentDate).replace(/^\w/, (c) => c.toUpperCase());
  };

  // Handle toggling content types
  const handleToggleContentType = (type: 'video' | 'story' | 'image') => {
    setContentTypes(prev => {
      const updated = { ...prev, [type]: !prev[type] };
      // Ensure at least one type is selected
      if (!updated.video && !updated.story && !updated.image) {
        return prev;
      }
      return updated;
    });
  };
  
  return (
    <Layout title="Agenda Criativa">
      <div className="grid gap-6">
        {/* Calendar header and controls */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  <span>Agenda Criativa Inteligente</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrevMonth}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="font-medium min-w-[140px] text-center">
                    {formatMonthYear()}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextMonth}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardTitle>
            <CardDescription>
              Planeje sua agenda de conteúdo com sugestões personalizadas geradas por IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Frequência de Conteúdo
                  </label>
                  <div className="flex gap-4">
                    <div className="flex-grow">
                      <Select
                        value={frequency.toString()}
                        onValueChange={(value) => setFrequency(parseInt(value) as 1 | 2 | 3)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a frequência" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1x por semana</SelectItem>
                          <SelectItem value="2">2x por semana</SelectItem>
                          <SelectItem value="3">3x por semana</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => setEmailAlertOpen(true)}
                    >
                      <Mail className="h-4 w-4" />
                      <span className="hidden sm:inline">Alertas</span>
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Equipamento
                  </label>
                  <Select
                    value={selectedEquipment}
                    onValueChange={setSelectedEquipment}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um equipamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos equipamentos</SelectItem>
                      <SelectItem value="Adélla">Adélla</SelectItem>
                      <SelectItem value="Enygma">Enygma</SelectItem>
                      <SelectItem value="Hipro">Hipro</SelectItem>
                      <SelectItem value="Reverso">Reverso</SelectItem>
                      <SelectItem value="Ultralift">Ultralift</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tipos de Conteúdo
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="content-video" 
                        checked={contentTypes.video}
                        onCheckedChange={() => handleToggleContentType('video')}
                      />
                      <Label htmlFor="content-video">Vídeos</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="content-story" 
                        checked={contentTypes.story}
                        onCheckedChange={() => handleToggleContentType('story')}
                      />
                      <Label htmlFor="content-story">Stories</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="content-image" 
                        checked={contentTypes.image}
                        onCheckedChange={() => handleToggleContentType('image')}
                      />
                      <Label htmlFor="content-image">Imagens</Label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Preferências de Conteúdo
                  </label>
                  <div className="flex space-x-2">
                    <Textarea
                      placeholder="Ex: Quero focar em tratamentos de lipedema este mês"
                      value={observations}
                      onChange={(e) => setObservations(e.target.value)}
                      className="flex-grow"
                    />
                    <Button className="self-end" onClick={handleSaveObservations}>
                      Salvar
                    </Button>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Separator className="mb-4" />
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Ações do Planejamento</h3>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        onClick={() => setConfirmClearOpen(true)}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="hidden sm:inline">Limpar</span>
                      </Button>
                      <Button 
                        variant="default" 
                        className="flex items-center gap-2"
                        onClick={() => setConfirmApproveOpen(true)}
                      >
                        <Check className="h-4 w-4" />
                        <span className="hidden sm:inline">Aprovar</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Calendar grid */}
        <Card>
          <CardContent className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center">
                  <LoaderIcon className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Gerando sua agenda criativa...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <div
                      key={day}
                      className="text-center font-medium text-sm py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {generateCalendarDays().map((day, index) => (
                    <CalendarDay
                      key={index}
                      date={day.date}
                      suggestion={day.suggestion}
                      isCurrentMonth={day.isCurrentMonth}
                      onUpdate={fetchCalendarSuggestions}
                    />
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Email Alerts Dialog */}
      <AlertDialog open={emailAlertOpen} onOpenChange={setEmailAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Configurar Alertas</AlertDialogTitle>
            <AlertDialogDescription>
              Configure como e quando deseja receber alertas sobre seu calendário de conteúdo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="email-alerts">Alertas por e-mail</Label>
                <p className="text-sm text-muted-foreground">
                  Receba lembretes sobre sua agenda de conteúdo
                </p>
              </div>
              <Switch 
                id="email-alerts" 
                checked={emailEnabled}
                onCheckedChange={setEmailEnabled}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Frequência de alertas</Label>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="freq-daily"
                    name="email-frequency"
                    className="h-4 w-4"
                    checked={emailFrequency === "daily"}
                    onChange={() => setEmailFrequency("daily")}
                    disabled={!emailEnabled}
                  />
                  <Label htmlFor="freq-daily" className="cursor-pointer">
                    <div className="font-medium">📩 3 sugestões por semana</div>
                    <div className="text-sm text-muted-foreground">
                      Receba as melhores sugestões de conteúdo
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="freq-weekly"
                    name="email-frequency"
                    className="h-4 w-4"
                    checked={emailFrequency === "weekly"}
                    onChange={() => setEmailFrequency("weekly")}
                    disabled={!emailEnabled}
                  />
                  <Label htmlFor="freq-weekly" className="cursor-pointer">
                    <div className="font-medium">📩 1 grade completa semanal</div>
                    <div className="text-sm text-muted-foreground">
                      Receba todas as sugestões organizadas para a semana
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="freq-intelligent"
                    name="email-frequency"
                    className="h-4 w-4"
                    checked={emailFrequency === "intelligent"}
                    onChange={() => setEmailFrequency("intelligent")}
                    disabled={!emailEnabled}
                  />
                  <Label htmlFor="freq-intelligent" className="cursor-pointer">
                    <div className="font-medium">📩 Sugestões inteligentes</div>
                    <div className="text-sm text-muted-foreground">
                      Baseadas no seu comportamento e preferências
                    </div>
                  </Label>
                </div>
              </div>
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveEmailPreferences}>
              Salvar Preferências
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Confirm Clear Planning Dialog */}
      <AlertDialog open={confirmClearOpen} onOpenChange={setConfirmClearOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limpar Planejamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja limpar todo o planejamento deste mês? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleClearPlanning}
              className="bg-destructive hover:bg-destructive/90 focus:ring-destructive"
            >
              Limpar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Confirm Approve Planning Dialog */}
      <AlertDialog open={confirmApproveOpen} onOpenChange={setConfirmApproveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aprovar Planejamento</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja aprovar o planejamento atual para este mês? Isso irá salvar todas as sugestões no calendário.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprovePlanning}>
              Aprovar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Calendar;
