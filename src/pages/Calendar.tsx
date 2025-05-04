
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { 
  CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Filter, 
  Calendar as CalendarLucide,
  Check,
  X,
  MoreHorizontal,
  AlertTriangle
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getCalendarSuggestions, updateCalendarCompletion, clearPlanning, approvePlanning, setCalendarPreferences } from '@/utils/api';
import { CalendarSuggestion, CalendarPreferences } from '@/utils/api';
import { useUser } from '@/hooks/useUser';

// Define tipos adicionais para estruturas de dados do calendário
interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  hasEvent: boolean;
  events: CalendarSuggestion[];
}

const CalendarPage: React.FC = () => {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [suggestions, setSuggestions] = useState<CalendarSuggestion[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [dayEvents, setDayEvents] = useState<CalendarSuggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [addEventOpen, setAddEventOpen] = useState<boolean>(false);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const { user, isLoading: isUserLoading } = useUser();

  // Estados para criação/edição de eventos
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [newEventDescription, setNewEventDescription] = useState<string>("");
  const [newEventFormat, setNewEventFormat] = useState<"video" | "story" | "image">("video");
  const [newEventEquipment, setNewEventEquipment] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<CalendarSuggestion | null>(null);

  // Estados para preferências do calendário
  const [preferences, setPreferences] = useState<CalendarPreferences>({
    frequency: 3,
    formats: ["video", "story", "image"],
    equipment: undefined,
    purpose: undefined
  });

  // Estados para a visualização do calendário
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [viewMode, setViewMode] = useState<'month' | 'schedule'>('month');
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);

  // Efeito para carregar as sugestões ao montar o componente
  useEffect(() => {
    if (!isUserLoading && user) {
      fetchSuggestions();
    }
  }, [user, isUserLoading]);

  // Efeito para gerar os dias do calendário
  useEffect(() => {
    const start = startOfMonth(viewDate);
    const end = endOfMonth(viewDate);
    const daysInMonth = eachDayOfInterval({ start, end });
    
    // Adiciona dias do início da semana (se o mês não começa no domingo)
    const firstDayOfWeek = start.getDay();
    const prevDays = [];
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(start);
      date.setDate(date.getDate() - (i + 1));
      prevDays.push(date);
    }
    
    // Adiciona dias do final do mês (se o mês não termina no sábado)
    const lastDayOfWeek = end.getDay();
    const nextDays = [];
    for (let i = 1; i < 7 - lastDayOfWeek; i++) {
      const date = new Date(end);
      date.setDate(date.getDate() + i);
      nextDays.push(date);
    }
    
    const allDays = [...prevDays, ...daysInMonth, ...nextDays].map(date => {
      const eventsOnDay = suggestions.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === date.getDate() && 
               eventDate.getMonth() === date.getMonth() && 
               eventDate.getFullYear() === date.getFullYear();
      });
      
      return {
        date,
        isCurrentMonth: date.getMonth() === viewDate.getMonth(),
        hasEvent: eventsOnDay.length > 0,
        events: eventsOnDay
      };
    });
    
    setCalendarDays(allDays);
  }, [viewDate, suggestions]);

  // Efeito para atualizar os eventos do dia selecionado
  useEffect(() => {
    if (selectedDay) {
      const eventsOnSelectedDay = suggestions.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === selectedDay.getDate() && 
               eventDate.getMonth() === selectedDay.getMonth() && 
               eventDate.getFullYear() === selectedDay.getFullYear();
      });
      setDayEvents(eventsOnSelectedDay);
    } else {
      setDayEvents([]);
    }
  }, [selectedDay, suggestions]);

  const fetchSuggestions = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const fetchedSuggestions = await getCalendarSuggestions();
      setSuggestions(fetchedSuggestions);
    } catch (error) {
      console.error("Erro ao buscar sugestões:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar sugestões",
        description: "Não foi possível carregar as sugestões para este dia.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    setViewDate(subMonths(viewDate, 1));
  };

  const handleNextMonth = () => {
    setViewDate(addMonths(viewDate, 1));
  };

  const handleDayClick = (day: CalendarDay) => {
    setSelectedDay(day.date);
  };

  const handleCompletionToggle = async (event: CalendarSuggestion, completed: boolean) => {
    try {
      await updateCalendarCompletion(event.date, completed);
      setSuggestions(prev => prev.map(s => 
        s.date === event.date ? { ...s, completed } : s
      ));
      
      toast({
        title: "Status atualizado",
        description: `A sugestão foi marcada como ${completed ? 'concluída' : 'não concluída'}.`,
      });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da sugestão.",
      });
    }
  };

  const handleClearPlanning = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      await clearPlanning();
      setSuggestions([]);
      setDayEvents([]);
      toast({
        title: "Planejamento limpo",
        description: "Todas as sugestões foram removidas do seu calendário.",
      });
    } catch (error) {
      console.error("Erro ao limpar planejamento:", error);
      toast({
        variant: "destructive",
        title: "Erro ao limpar planejamento",
        description: "Não foi possível limpar o planejamento do calendário.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      setLoading(true);
      await setCalendarPreferences(preferences);
      await approvePlanning();
      
      toast({
        title: "Preferências salvas",
        description: "Suas preferências de calendário foram salvas com sucesso.",
      });
      
      await fetchSuggestions();
      setFilterOpen(false);
    } catch (error) {
      console.error("Erro ao salvar preferências:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar preferências",
        description: "Não foi possível salvar suas preferências de calendário.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getFormatBadge = (format: string) => {
    switch (format) {
      case "video":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Vídeo</Badge>;
      case "story":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Story</Badge>;
      case "image":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Imagem</Badge>;
      default:
        return <Badge>{format}</Badge>;
    }
  };

  const handleCreateEvent = () => {
    if (!selectedDay || !newEventTitle) return;
    
    const newEvent: CalendarSuggestion = {
      date: selectedDay.toISOString(),
      title: newEventTitle,
      description: newEventDescription || "",
      format: newEventFormat,
      completed: false,
      equipment: newEventEquipment || undefined
    };
    
    setSuggestions([...suggestions, newEvent]);
    setNewEventTitle("");
    setNewEventDescription("");
    setNewEventFormat("video");
    setNewEventEquipment("");
    setCreateDialogOpen(false);
    
    toast({
      title: "Evento criado",
      description: "O evento foi criado com sucesso.",
    });
  };

  const handleEditEvent = (event: CalendarSuggestion) => {
    setSelectedEvent(event);
    setNewEventTitle(event.title);
    setNewEventDescription(event.description || "");
    setNewEventFormat(event.format);
    setNewEventEquipment(event.equipment || "");
    setCreateDialogOpen(true);
  };

  const handleDeleteEvent = (event: CalendarSuggestion) => {
    setSuggestions(suggestions.filter(s => s.date !== event.date));
    setDayEvents(dayEvents.filter(e => e.date !== event.date));
    
    toast({
      title: "Evento excluído",
      description: "O evento foi excluído com sucesso.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <CalendarLucide className="h-6 w-6 mr-2 text-blue-600" />
              Calendário de Conteúdo
            </h1>
            <p className="text-muted-foreground">
              Planeje, organize e acompanhe sua produção de conteúdo
            </p>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Tabs 
              value={viewMode} 
              onValueChange={(value) => setViewMode(value as 'month' | 'schedule')} 
              className="w-full sm:w-auto"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="month">Mês</TabsTrigger>
                <TabsTrigger value="schedule">Agenda</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setFilterOpen(true)}
              className={filterOpen ? "bg-muted" : ""}
              title="Configurar preferências do calendário"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {viewMode === 'month' ? (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-semibold">
                    {format(viewDate, 'MMMM yyyy', { locale: ptBR })}
                  </h2>
                  <span className="text-xs text-muted-foreground border border-border rounded-full px-2 py-0.5">
                    {suggestions.length} eventos
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setViewDate(new Date())}
                    className="text-xs"
                  >
                    Hoje
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Grade do Calendário */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                  <div key={day} className="text-center text-xs font-medium py-1">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => (
                  <div 
                    key={i}
                    onClick={() => handleDayClick(day)}
                    className={cn(
                      "min-h-[80px] p-1 border rounded-md cursor-pointer",
                      day.isCurrentMonth ? "bg-white" : "bg-gray-50",
                      isToday(day.date) && "border-blue-400",
                      selectedDay && selectedDay.getDate() === day.date.getDate() && 
                      selectedDay.getMonth() === day.date.getMonth() && 
                      selectedDay.getFullYear() === day.date.getFullYear() && "ring-2 ring-blue-500",
                      "hover:bg-gray-50 transition-colors"
                    )}
                  >
                    <div className="flex justify-between">
                      <span 
                        className={cn(
                          "text-xs font-medium h-6 w-6 flex items-center justify-center rounded-full",
                          isToday(day.date) && "bg-blue-500 text-white",
                          !day.isCurrentMonth && "text-gray-400"
                        )}
                      >
                        {day.date.getDate()}
                      </span>
                      {day.hasEvent && (
                        <span className="flex flex-wrap gap-1">
                          {day.events.slice(0, 2).map((event, i) => (
                            <span 
                              key={i} 
                              className={cn(
                                "h-2 w-2 rounded-full",
                                event.format === "video" && "bg-blue-500",
                                event.format === "story" && "bg-purple-500",
                                event.format === "image" && "bg-green-500",
                                event.completed && "opacity-50"
                              )}
                            />
                          ))}
                          {day.events.length > 2 && (
                            <span className="text-xs text-muted-foreground">
                              +{day.events.length - 2}
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                    
                    {day.events.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {day.events.slice(0, 2).map((event, i) => (
                          <div 
                            key={i} 
                            className={cn(
                              "text-xs truncate px-1 py-0.5 rounded",
                              event.format === "video" && "bg-blue-50 text-blue-700",
                              event.format === "story" && "bg-purple-50 text-purple-700",
                              event.format === "image" && "bg-green-50 text-green-700",
                              event.completed && "line-through opacity-50"
                            )}
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}
                        {day.events.length > 2 && (
                          <div className="text-xs text-muted-foreground px-1">
                            + {day.events.length - 2} mais
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    <span>Vídeo</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                    <span>Story</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    <span>Imagem</span>
                  </div>
                </div>
              </div>
              
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm"
                    onClick={() => {
                      setSelectedEvent(null);
                      setNewEventTitle("");
                      setNewEventDescription("");
                      setNewEventFormat("video");
                      setNewEventEquipment("");
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" /> 
                    Criar Evento
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{selectedEvent ? "Editar Evento" : "Criar Novo Evento"}</DialogTitle>
                    <DialogDescription>
                      {selectedEvent 
                        ? "Altere os detalhes do evento selecionado." 
                        : "Adicione um novo evento ao calendário."}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-title">Título</Label>
                      <Input 
                        id="event-title" 
                        value={newEventTitle} 
                        onChange={(e) => setNewEventTitle(e.target.value)}
                        placeholder="Ex: Gravar vídeo sobre tratamento facial"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="event-description">Descrição (opcional)</Label>
                      <Textarea 
                        id="event-description" 
                        value={newEventDescription} 
                        onChange={(e) => setNewEventDescription(e.target.value)}
                        placeholder="Adicione detalhes sobre o evento"
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="event-format">Formato</Label>
                        <Select 
                          value={newEventFormat} 
                          onValueChange={(value) => setNewEventFormat(value as "video" | "story" | "image")}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um formato" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="video">Vídeo</SelectItem>
                            <SelectItem value="story">Story</SelectItem>
                            <SelectItem value="image">Imagem</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="event-equipment">Equipamento (opcional)</Label>
                        <Input 
                          id="event-equipment" 
                          value={newEventEquipment} 
                          onChange={(e) => setNewEventEquipment(e.target.value)}
                          placeholder="Ex: Ultraformer"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Data</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !selectedDay && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDay ? format(selectedDay, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDay || undefined}
                            onSelect={(date) => date && setSelectedDay(date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setCreateDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="button" 
                      onClick={handleCreateEvent}
                      disabled={!selectedDay || !newEventTitle}
                    >
                      {selectedEvent ? "Salvar Alterações" : "Criar Evento"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Eventos Agendados</CardTitle>
                  <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm"
                        onClick={() => {
                          setSelectedEvent(null);
                          setNewEventTitle("");
                          setNewEventDescription("");
                          setNewEventFormat("video");
                          setNewEventEquipment("");
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" /> 
                        Novo Evento
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      {/* Conteúdo do diálogo (mesmo que acima) */}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-10">
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                      <p className="mt-2 text-sm text-muted-foreground">Carregando eventos...</p>
                    </div>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((event, index) => (
                      <Card key={index} className="overflow-hidden">
                        <div className={cn(
                          "h-1.5 w-full",
                          event.format === "video" ? "bg-blue-500" : 
                          event.format === "story" ? "bg-purple-500" : 
                          "bg-green-500"
                        )} />
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{event.title}</h3>
                                {getFormatBadge(event.format)}
                                {event.completed && (
                                  <Badge variant="outline" className="bg-green-100 text-green-800">Concluído</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{event.description}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <CalendarIcon className="h-3.5 w-3.5" />
                                <span>{format(new Date(event.date), "PP", { locale: ptBR })}</span>
                                
                                {event.equipment && (
                                  <>
                                    <span>•</span>
                                    <span>{event.equipment}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-2">
                              <Button
                                variant={event.completed ? "outline" : "default"}
                                size="sm"
                                onClick={() => handleCompletionToggle(event, !event.completed)}
                              >
                                {event.completed ? (
                                  <X className="h-4 w-4 mr-1" />
                                ) : (
                                  <Check className="h-4 w-4 mr-1" />
                                )}
                                {event.completed ? "Desfazer" : "Concluir"}
                              </Button>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleEditEvent(event)}>
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => handleDeleteEvent(event)}
                                  >
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <CalendarIcon className="h-10 w-10 text-muted-foreground mb-3" />
                      <h3 className="font-medium text-lg mb-1">Nenhum evento agendado</h3>
                      <p className="text-muted-foreground mb-4">
                        Crie seu primeiro evento ou configure suas preferências para receber sugestões.
                      </p>
                      <Button onClick={() => setCreateDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-1" /> Criar Evento
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
              
              {suggestions.length > 0 && (
                <CardFooter className="border-t pt-4 flex justify-between">
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <CalendarLucide className="h-4 w-4" />
                    <span>{suggestions.length} eventos no total</span>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleClearPlanning}
                    disabled={loading}
                  >
                    Limpar Calendário
                  </Button>
                </CardFooter>
              )}
            </Card>
            
            {selectedDay && dayEvents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Eventos em {format(selectedDay, "PPP", { locale: ptBR })}
                  </CardTitle>
                  <CardDescription>
                    {dayEvents.length} evento(s) agendado(s) para este dia
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dayEvents.map((event, index) => (
                      <div 
                        key={index}
                        className={cn(
                          "flex items-start border-l-2 p-3 rounded-md bg-gray-50",
                          event.format === "video" ? "border-blue-500" : 
                          event.format === "story" ? "border-purple-500" : 
                          "border-green-500",
                          event.completed && "opacity-70"
                        )}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{event.title}</h4>
                            {getFormatBadge(event.format)}
                          </div>
                          {event.description && (
                            <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                          )}
                          {event.equipment && (
                            <p className="text-xs text-muted-foreground mt-1">Equipamento: {event.equipment}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "flex items-center gap-1",
                            event.completed ? "text-green-600 hover:text-green-700" : "text-blue-600 hover:text-blue-700"
                          )}
                          onClick={() => handleCompletionToggle(event, !event.completed)}
                        >
                          {event.completed ? (
                            <X className="h-4 w-4" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                          {event.completed ? "Desfazer" : "Concluir"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
                
        {/* Preferências do Calendário */}
        <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Preferências do Calendário</DialogTitle>
              <DialogDescription>
                Configure suas preferências para receber sugestões personalizadas de conteúdo.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="frequency">Frequência de Publicação (por semana)</Label>
                <div className="flex items-center gap-4 mt-2">
                  <input 
                    type="range" 
                    id="frequency" 
                    min="1" 
                    max="7" 
                    value={preferences.frequency} 
                    onChange={(e) => setPreferences({...preferences, frequency: parseInt(e.target.value)})}
                    className="w-full"
                  />
                  <span className="font-medium">{preferences.frequency}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Quantidade de conteúdos que você deseja publicar semanalmente.
                </p>
              </div>
              
              <div>
                <Label>Tipos de Conteúdo</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="format-video" 
                      checked={preferences.formats.includes("video")} 
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setPreferences({...preferences, formats: [...preferences.formats, "video"]});
                        } else {
                          setPreferences({...preferences, formats: preferences.formats.filter(f => f !== "video")});
                        }
                      }}
                    />
                    <label htmlFor="format-video" className="text-sm">Vídeos</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="format-story" 
                      checked={preferences.formats.includes("story")} 
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setPreferences({...preferences, formats: [...preferences.formats, "story"]});
                        } else {
                          setPreferences({...preferences, formats: preferences.formats.filter(f => f !== "story")});
                        }
                      }}
                    />
                    <label htmlFor="format-story" className="text-sm">Stories</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="format-image" 
                      checked={preferences.formats.includes("image")} 
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setPreferences({...preferences, formats: [...preferences.formats, "image"]});
                        } else {
                          setPreferences({...preferences, formats: preferences.formats.filter(f => f !== "image")});
                        }
                      }}
                    />
                    <label htmlFor="format-image" className="text-sm">Imagens</label>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="equipment">Equipamento (opcional)</Label>
                  <Input 
                    id="equipment" 
                    value={preferences.equipment || ""}
                    onChange={(e) => setPreferences({...preferences, equipment: e.target.value || undefined})}
                    placeholder="Ex: Ultraformer"
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Foca em um equipamento específico.
                  </p>
                </div>
                <div>
                  <Label htmlFor="purpose">Objetivo (opcional)</Label>
                  <Input 
                    id="purpose" 
                    value={preferences.purpose || ""}
                    onChange={(e) => setPreferences({...preferences, purpose: e.target.value || undefined})}
                    placeholder="Ex: Venda, Engajamento"
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Objetivo principal das suas publicações.
                  </p>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-800 font-medium">Aviso</p>
                  <p className="text-sm text-amber-700">Salvar novas preferências irá gerar um novo conjunto de sugestões e substituir o planejamento atual.</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFilterOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSavePreferences} disabled={loading}>
                {loading ? "Salvando..." : "Salvar Preferências"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default CalendarPage;
