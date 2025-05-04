import React, { useState, useEffect } from 'react';
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CalendarDay from "@/components/CalendarDay";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useEquipments } from "@/hooks/useEquipments";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getCalendarSuggestions, updateCalendarCompletion, clearPlanning, approvePlanning, setCalendarPreferences, CalendarSuggestion, CalendarPreferences } from "@/utils/api";
import { CalendarPlus, CheckCheck, Loader2, RefreshCcw, VideoIcon, Image as ImageIcon, History } from "lucide-react";

const frequencyOptions = [
  { value: "daily", label: "Diário" },
  { value: "weekly", label: "Semanal" },
  { value: "custom", label: "Personalizado" }
];

const contentFormats = [
  { value: "video", label: "Vídeo", icon: <VideoIcon className="h-4 w-4 mr-2" /> },
  { value: "image", label: "Imagem", icon: <ImageIcon className="h-4 w-4 mr-2" /> },
  { value: "story", label: "Story", icon: <History className="h-4 w-4 mr-2" /> }
];

const contentPurposes = [
  { value: "demonstration", label: "Demonstração" },
  { value: "education", label: "Educação" },
  { value: "testimonial", label: "Depoimentos" },
  { value: "promotion", label: "Promoção" }
];

const defaultPreferences: CalendarPreferences = {
  frequency: "weekly",
  topics: [],
  equipment: [],
  formats: ["video", "image", "story"], 
  purpose: ["demonstration", "education"],
  autoGenerate: true
};

const Calendar: React.FC = () => {
  const { toast } = useToast();
  const { equipments } = useEquipments();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [calendarEvents, setCalendarEvents] = useState<CalendarSuggestion[]>([]);
  const [preferencesDialogOpen, setPreferencesDialogOpen] = useState(false);
  const [newEventDialogOpen, setNewEventDialogOpen] = useState(false);
  const [preferences, setPreferences] = useState<CalendarPreferences>(defaultPreferences);
  const [selectedFormat, setSelectedFormat] = useState<"video" | "image" | "story">("video");
  const [selectedEvent, setSelectedEvent] = useState<CalendarSuggestion | null>(null);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [approving, setApproving] = useState(false);
  
  const [newEvent, setNewEvent] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    title: '',
    description: '',
    format: selectedFormat,
    completed: false,
    equipment: ''
  });

  useEffect(() => {
    fetchCalendarEvents();
  }, [currentDate]);

  const fetchCalendarEvents = async () => {
    try {
      setLoading(true);
      const events = await getCalendarSuggestions();
      setCalendarEvents(events);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar",
        description: "Não foi possível carregar os eventos do calendário."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
  };

  const handleEventCompletion = async (event: CalendarSuggestion, completed: boolean) => {
    try {
      await updateCalendarCompletion(event.date, completed);
      setCalendarEvents(prevEvents =>
        prevEvents.map(e =>
          e.id === event.id ? { ...e, completed } : e
        )
      );
      toast({
        title: "Status atualizado",
        description: `O status do evento foi atualizado para ${completed ? 'concluído' : 'pendente'}.`
      });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o status do evento."
      });
    }
  };

  const handleClearPlanning = async () => {
    try {
      setRegenerating(true);
      await clearPlanning();
      toast({
        title: "Planejamento limpo",
        description: "O planejamento do calendário foi limpo com sucesso."
      });
      await fetchCalendarEvents();
    } catch (error) {
      console.error("Erro ao limpar planejamento:", error);
      toast({
        variant: "destructive",
        title: "Erro ao limpar",
        description: "Não foi possível limpar o planejamento do calendário."
      });
    } finally {
      setRegenerating(false);
    }
  };

  const handleApprovePlanning = async () => {
    try {
      setApproving(true);
      await approvePlanning();
      toast({
        title: "Planejamento aprovado",
        description: "O planejamento do calendário foi aprovado com sucesso."
      });
      await fetchCalendarEvents();
    } catch (error) {
      console.error("Erro ao aprovar planejamento:", error);
      toast({
        variant: "destructive",
        title: "Erro ao aprovar",
        description: "Não foi possível aprovar o planejamento do calendário."
      });
    } finally {
      setApproving(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      setSaving(true);
      
      await setCalendarPreferences(preferences);
      
      toast({
        title: "Preferências salvas",
        description: "Suas preferências de planejamento foram salvas com sucesso."
      });
      
      setPreferencesDialogOpen(false);
      await fetchCalendarEvents();
    } catch (error) {
      console.error("Erro ao salvar preferências:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas preferências."
      });
    } finally {
      setSaving(false);
    }
  };

  const handleNewEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewEvent(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormatChange = (format: "video" | "image" | "story") => {
    setSelectedFormat(format);
    setNewEvent(prev => ({ ...prev, format }));
  };

  const handleEquipmentChange = (equipment: string) => {
    setNewEvent(prev => ({ ...prev, equipment }));
  };

  const handleNewEventSubmit = async () => {
    try {
      setSaving(true);
      
      const newSuggestion: CalendarSuggestion = {
        id: `new-${Date.now()}`,
        date: newEvent.date,
        title: newEvent.title,
        description: newEvent.description,
        format: newEvent.format,
        equipment: newEvent.equipment,
        completed: false
      };
      
      // In a real implementation, this would call an API endpoint
      setCalendarEvents(prev => [...prev, newSuggestion]);
      
      toast({
        title: "Evento adicionado",
        description: "O novo evento foi adicionado ao calendário."
      });
      
      setNewEventDialogOpen(false);
      setNewEvent({
        date: format(new Date(), 'yyyy-MM-dd'),
        title: '',
        description: '',
        format: selectedFormat,
        completed: false,
        equipment: ''
      });
    } catch (error) {
      console.error("Erro ao adicionar evento:", error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar",
        description: "Não foi possível adicionar o evento."
      });
    } finally {
      setSaving(false);
    }
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <Layout title="Calendário de Conteúdo">
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-semibold">
                {format(currentDate, "MMMM yyyy", { locale: ptBR })}
              </CardTitle>
              <CardDescription>
                Planeje e organize seu conteúdo para as redes sociais
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={prevMonth}>
                Anterior
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                Próximo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-7">
            {daysInMonth.map((day) => (
              <CalendarDay
                key={day.toISOString()}
                date={day}
                events={calendarEvents.filter(event => isSameDay(new Date(event.date), day))}
                onClick={() => handleDayClick(day)}
                onEventCompletion={handleEventCompletion}
                isCurrentMonth={
                  day >= firstDayOfMonth && day <= lastDayOfMonth
                }
              />
            ))}
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Button onClick={() => setPreferencesDialogOpen(true)}>
              <CalendarPlus className="h-4 w-4 mr-2" />
              Preferências
            </Button>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={handleClearPlanning}
                disabled={regenerating}
              >
                {regenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Limpando...
                  </>
                ) : (
                  <>
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Limpar Planejamento
                  </>
                )}
              </Button>
              <Button
                onClick={handleApprovePlanning}
                disabled={approving}
              >
                {approving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Aprovando...
                  </>
                ) : (
                  <>
                    <CheckCheck className="h-4 w-4 mr-2" />
                    Aprovar Planejamento
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Dialog open={preferencesDialogOpen} onOpenChange={setPreferencesDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Preferências de Planejamento</DialogTitle>
              <DialogDescription>
                Defina suas preferências para a geração automática de conteúdo.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequência</Label>
                <Select
                  value={preferences.frequency}
                  onValueChange={(value) => setPreferences({ ...preferences, frequency: value as "daily" | "weekly" | "custom" })}
                >
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {frequencyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Formatos de Conteúdo</Label>
                <div className="grid grid-cols-3 gap-2">
                  {contentFormats.map((formatOption) => (
                    <Button
                      key={formatOption.value}
                      variant={preferences.formats?.includes(formatOption.value) ? "default" : "outline"}
                      onClick={() => {
                        const newFormats = preferences.formats?.includes(formatOption.value)
                          ? preferences.formats.filter(f => f !== formatOption.value)
                          : [...(preferences.formats || []), formatOption.value];
                        setPreferences({ ...preferences, formats: newFormats });
                      }}
                    >
                      {formatOption.icon}
                      {formatOption.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Finalidades do Conteúdo</Label>
                <div className="grid grid-cols-2 gap-2">
                  {contentPurposes.map((purposeOption) => (
                    <Button
                      key={purposeOption.value}
                      variant={preferences.purpose?.includes(purposeOption.value) ? "default" : "outline"}
                      onClick={() => {
                        const newPurposes = preferences.purpose?.includes(purposeOption.value)
                          ? preferences.purpose.filter(p => p !== purposeOption.value)
                          : [...(preferences.purpose || []), purposeOption.value];
                        setPreferences({ ...preferences, purpose: newPurposes });
                      }}
                    >
                      {purposeOption.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="topics">Tópicos</Label>
                <Input
                  id="topics"
                  placeholder="Ex: Dicas de skincare, Novidades em tratamentos"
                  value={preferences.topics.join(', ')}
                  onChange={(e) => setPreferences({ ...preferences, topics: e.target.value.split(',').map(t => t.trim()) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="equipment">Equipamentos</Label>
                <Select
                  onValueChange={(value) => setPreferences({ ...preferences, equipment: [value] })}
                >
                  <SelectTrigger id="equipment">
                    <SelectValue placeholder="Selecione um equipamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {equipments.map((equipment) => (
                        <SelectItem key={equipment.id} value={equipment.id}>
                          {equipment.nome}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-generate"
                  checked={preferences.autoGenerate}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, autoGenerate: checked })}
                />
                <Label htmlFor="auto-generate">Gerar automaticamente</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setPreferencesDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" onClick={handleSavePreferences} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Preferências"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={newEventDialogOpen} onOpenChange={setNewEventDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Novo Evento</DialogTitle>
              <DialogDescription>
                Adicione um novo evento ao calendário.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  value={newEvent.date}
                  onChange={handleNewEventChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={newEvent.title}
                  onChange={handleNewEventChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newEvent.description}
                  onChange={handleNewEventChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="format">Formato</Label>
                <Select onValueChange={handleFormatChange} defaultValue={selectedFormat}>
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Selecione um formato" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentFormats.map((formatOption) => (
                      <SelectItem key={formatOption.value} value={formatOption.value}>
                        {formatOption.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="equipment">Equipamento</Label>
                <Select onValueChange={handleEquipmentChange}>
                  <SelectTrigger id="equipment">
                    <SelectValue placeholder="Selecione um equipamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {equipments.map((equipment) => (
                        <SelectItem key={equipment.id} value={equipment.id}>
                          {equipment.nome}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setNewEventDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" onClick={handleNewEventSubmit} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Evento"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Calendar;
