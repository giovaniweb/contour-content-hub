import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCheck, ChevronsUpDown } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CalendarSuggestion, CalendarPreferences, getCalendarSuggestions, updateCalendarCompletion, setCalendarPreferences } from "@/utils/api";
import { useEquipments } from "@/hooks/useEquipments";
import { Checkbox } from "@/components/ui/checkbox";

const CalendarPage: React.FC = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(Date.now() + 604800000) // +7 dias
  });
  const [selectedEquipment, setSelectedEquipment] = useState<string>("");
  const [selectedFormat, setSelectedFormat] = useState<"video" | "image" | "story">("video");
  const [selectedHook, setSelectedHook] = useState<string>("");
  const [selectedCaption, setSelectedCaption] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPlanningDialogOpen, setIsPlanningDialogOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<CalendarSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [preferences, setPreferences] = useState<CalendarPreferences>({
    frequency: "weekly",
    topics: [],
    equipment: [],
    autoGenerate: true,
    formats: []
});
  const { toast } = useToast();
  const { equipments, loading: equipmentsLoading } = useEquipments();
  const [formatPreferences, setFormatPreferences] = useState<string[]>([]);
  const [topicOptions, setTopicOptions] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>([]);
  const [selectedPurpose, setSelectedPurpose] = useState<string>("");

  useEffect(() => {
    document.title = "Planejamento de Conteúdo | Fluida";
  }, []);

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        setIsLoading(true);
        const data = await getCalendarSuggestions();
        setSuggestions(data);
      } catch (error) {
        console.error("Erro ao carregar sugestões:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar as sugestões do calendário.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSuggestions();
  }, []);

  useEffect(() => {
    // Simulação de busca de tópicos (substitua pela sua lógica real)
    const fetchTopics = async () => {
      // Simule uma chamada à API ou fonte de dados
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Dados de exemplo (substitua pelos seus dados reais)
      const topics = [
        "Dicas de skincare",
        "Mitos sobre tratamentos estéticos",
        "Novidades em tecnologia estética",
        "Rotina de beleza",
        "Alimentação e pele",
        "Exercícios faciais",
        "Maquiagem natural",
        "Proteção solar",
        "Tratamentos capilares",
        "Bem-estar e beleza"
      ];
      
      setTopicOptions(topics);
    };
    
    fetchTopics();
  }, []);

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const handleEquipmentToggle = (equipment: string) => {
    setSelectedEquipments(prev =>
      prev.includes(equipment) ? prev.filter(e => e !== equipment) : [...prev, equipment]
    );
  };

  const handleFormatToggle = (format: string) => {
    setFormatPreferences(
      formatPreferences.includes(format)
        ? formatPreferences.filter(f => f !== format)
        : [...formatPreferences, format]
  );
};

  const handleCreateSuggestion = async (date: Date) => {
    if (!selectedEquipment) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Selecione um equipamento para criar a sugestão.",
      });
      return;
    }

    const newSuggestion: CalendarSuggestion = {
      id: uuidv4(),
      date: date.toISOString(),
      title: `${selectedFormat === 'video' ? 'Vídeo' : selectedFormat === 'image' ? 'Imagem' : 'Story'} sobre ${selectedEquipment}`,
      description: `Conteúdo relacionado a ${selectedEquipment}`,
      format: selectedFormat as "image" | "video" | "story",
      completed: false,
      equipment: selectedEquipment
    };

    setSuggestions(prev => [...prev, newSuggestion]);
    setIsDialogOpen(false);
    toast({
      title: "Sugestão criada",
      description: "A sugestão foi adicionada ao seu calendário.",
    });
  };

  const handleUpdateCompletion = async (id: string, completed: boolean) => {
    try {
      await updateCalendarCompletion(id, completed);
      setSuggestions(prev =>
        prev.map(s => (s.id === id ? { ...s, completed } : s))
      );
    } catch (error) {
      console.error("Erro ao atualizar conclusão:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o status da sugestão.",
      });
    }
  };

  const handleClearPlanning = async () => {
    try {
      setIsClearing(true);
      // await clearPlanning(); // Supondo que você tenha uma função clearPlanning
      setSuggestions([]);
      toast({
        title: "Planejamento limpo",
        description: "Todas as sugestões foram removidas do seu calendário.",
      });
    } catch (error) {
      console.error("Erro ao limpar planejamento:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível limpar o planejamento.",
      });
    } finally {
      setIsClearing(false);
    }
  };

  const handleApprovePlanning = async () => {
    try {
      setIsApproving(true);
      // await approvePlanning(); // Supondo que você tenha uma função approvePlanning
      toast({
        title: "Planejamento aprovado",
        description: "Seu planejamento foi aprovado e está pronto para ser implementado.",
      });
    } catch (error) {
      console.error("Erro ao aprovar planejamento:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível aprovar o planejamento.",
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      setIsSaving(true);
      const randomEquipment = equipments[Math.floor(Math.random() * equipments.length)].nome;
      const prefs = {
        ...preferences,
        equipment: [randomEquipment],
        topics: selectedTopics,
        purpose: selectedPurpose
      };
      await setCalendarPreferences(prefs);
      toast({
        title: "Preferências salvas",
        description: "Suas preferências foram salvas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao salvar preferências:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar suas preferências.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const randomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };

  const handleGenerateSuggestions = () => {
    if (!date?.from || !date?.to) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Selecione um período para gerar sugestões.",
      });
      return;
    }

    if (equipmentsLoading || equipments.length === 0) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Aguarde o carregamento dos equipamentos para gerar sugestões.",
      });
      return;
    }

    const newSuggestions = [];
    for (let i = 0; i < 7; i++) {
      const randomEquipment = equipments[Math.floor(Math.random() * equipments.length)].nome;
      const randomDateValue = randomDate(date.from, date.to);
      const newSuggestion: CalendarSuggestion = {
        id: uuidv4(),
        date: randomDateValue.toISOString(),
        title: `${formatPreferences.includes('video') ? 'Vídeo' : formatPreferences.includes('image') ? 'Imagem' : 'Story'} sobre ${randomEquipment}`,
        description: `Conteúdo relacionado a ${randomEquipment}`,
        format: formatPreferences.includes('video') ? 'video' : formatPreferences.includes('image') ? 'image' : 'story',
        completed: false,
        equipment: [randomEquipment],
        purpose: selectedPurpose
      };
      newSuggestions.push(newSuggestion);
    }

    setSuggestions(prev => [...prev, ...newSuggestions]);
    toast({
      title: "Sugestões geradas",
      description: "Novas sugestões foram adicionadas ao seu calendário.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Planejamento de Conteúdo
            </CardTitle>
            <CardDescription>
              Organize suas ideias e planeje seu conteúdo para as redes sociais.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date?.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        `${format(date.from, "dd/MM/yyyy")} - ${format(date.to, "dd/MM/yyyy")}`
                      ) : (
                        format(date.from, "dd/MM/yyyy")
                      )
                    ) : (
                      <span>Escolha um período</span>
                    )}
                    <ChevronsUpDown className="ml-auto h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" side="bottom">
                  <Calendar
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    pagedNavigation
                    className="border-0 rounded-md"
                  />
                </PopoverContent>
              </Popover>

              <Button onClick={() => setIsPlanningDialogOpen(true)}>
                Definir Preferências
              </Button>

              <Button onClick={handleGenerateSuggestions} disabled={equipmentsLoading || equipments.length === 0}>
                Gerar Sugestões
              </Button>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                <div className="col-span-full text-center">Carregando sugestões...</div>
              ) : suggestions.length === 0 ? (
                <div className="col-span-full text-center">Nenhuma sugestão encontrada.</div>
              ) : (
                suggestions.map(suggestion => (
                  <Card key={suggestion.id} className="shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {suggestion.title}
                        <Badge variant="secondary">{suggestion.format}</Badge>
                      </CardTitle>
                      <CardDescription>
                        {format(new Date(suggestion.date), "dd/MM/yyyy")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{suggestion.description}</p>
                      <div className="flex items-center space-x-2 mt-4">
                        <Label htmlFor={`suggestion-${suggestion.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                          Concluído
                        </Label>
                        <Switch
                          id={`suggestion-${suggestion.id}`}
                          checked={suggestion.completed}
                          onCheckedChange={(checked) => handleUpdateCompletion(suggestion.id, checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            <Separator />

            <div className="flex justify-end space-x-2">
              <Button
                variant="destructive"
                onClick={handleClearPlanning}
                disabled={isClearing}
              >
                {isClearing ? "Limpando..." : "Limpar Planejamento"}
              </Button>
              <Button
                onClick={handleApprovePlanning}
                disabled={isApproving}
              >
                {isApproving ? "Aprovando..." : "Aprovar Planejamento"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dialogo de sugestão */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Criar Sugestão</DialogTitle>
              <DialogDescription>
                Adicione uma nova sugestão ao seu calendário de conteúdo.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="equipment" className="text-right">
                  Equipamento
                </Label>
                <Select onValueChange={setSelectedEquipment} defaultValue={selectedEquipment}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipmentsLoading ? (
                      <SelectItem value="carregando">Carregando...</SelectItem>
                    ) : (
                      equipments.map(eq => (
                        <SelectItem key={eq.id} value={eq.nome}>{eq.nome}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="format" className="text-right">
                  Formato
                </Label>
                <Select onValueChange={setSelectedFormat} defaultValue={selectedFormat}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Vídeo</SelectItem>
                    <SelectItem value="image">Imagem</SelectItem>
                    <SelectItem value="story">Story</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Data
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date?.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          `${format(date.from, "dd/MM/yyyy")} - ${format(date.to, "dd/MM/yyyy")}`
                        ) : (
                          format(date.from, "dd/MM/yyyy")
                        )
                      ) : (
                        <span>Escolha uma data</span>
                      )}
                      <ChevronsUpDown className="ml-auto h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start" side="bottom">
                    <Calendar
                      mode="single"
                      defaultMonth={date?.from}
                      selected={date?.from}
                      onSelect={(date) => setDate({ from: date, to: date })}
                      numberOfMonths={2}
                      pagedNavigation
                      className="border-0 rounded-md"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => handleCreateSuggestion(date?.from || new Date())}>
                Criar Sugestão
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialogo de planejamento */}
        <Dialog open={isPlanningDialogOpen} onOpenChange={setIsPlanningDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Definir Preferências</DialogTitle>
              <DialogDescription>
                Configure suas preferências para o planejamento de conteúdo.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="frequency" className="text-right">
                  Frequência
                </Label>
                <Select onValueChange={(value) => setPreferences({ ...preferences, frequency: value as "daily" | "weekly" | "custom" })} defaultValue={preferences.frequency}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="topics" className="text-right">
                  Tópicos
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={topicOptions.length > 0}
                      className="w-full justify-between col-span-3"
                    >
                      {selectedTopics.length > 0 ? (
                        selectedTopics.map(topic => (
                          <Badge key={topic} variant="secondary">{topic}</Badge>
                        ))
                      ) : (
                        "Selecione os tópicos"
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Buscar tópico..." />
                      <CommandEmpty>Nenhum tópico encontrado.</CommandEmpty>
                      <CommandGroup>
                        {topicOptions.map(topic => (
                          <CommandItem
                            key={topic}
                            onSelect={() => handleTopicToggle(topic)}
                          >
                            <Checkbox
                              checked={selectedTopics.includes(topic)}
                              className="mr-2 h-4 w-4"
                            />
                            {topic}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="equipment" className="text-right">
                  Equipamentos
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={equipments.length > 0}
                      className="w-full justify-between col-span-3"
                    >
                      {selectedEquipments.length > 0 ? (
                        selectedEquipments.map(equipment => (
                          <Badge key={equipment} variant="secondary">{equipment}</Badge>
                        ))
                      ) : (
                        "Selecione os equipamentos"
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Buscar equipamento..." />
                      <CommandEmpty>Nenhum equipamento encontrado.</CommandEmpty>
                      <CommandGroup>
                        {equipments.map(equipment => (
                          <CommandItem
                            key={equipment.id}
                            onSelect={() => handleEquipmentToggle(equipment.nome)}
                          >
                            <Checkbox
                              checked={selectedEquipments.includes(equipment.nome)}
                              className="mr-2 h-4 w-4"
                            />
                            {equipment.nome}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="format" className="text-right">
                  Formatos
                </Label>
                <div className="col-span-3 flex space-x-2">
                  <Button
                    variant={formatPreferences.includes("video") ? "default" : "outline"}
                    onClick={() => handleFormatToggle("video")}
                  >
                    Vídeo
                  </Button>
                  <Button
                    variant={formatPreferences.includes("image") ? "default" : "outline"}
                    onClick={() => handleFormatToggle("image")}
                  >
                    Imagem
                  </Button>
                  <Button
                    variant={formatPreferences.includes("story") ? "default" : "outline"}
                    onClick={() => handleFormatToggle("story")}
                  >
                    Story
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="purpose" className="text-right">
                  Finalidade
                </Label>
                <Textarea
                  id="purpose"
                  className="col-span-3"
                  placeholder="Ex: Divulgar novo tratamento, Educar sobre os benefícios, etc."
                  value={selectedPurpose}
                  onChange={(e) => setSelectedPurpose(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="autoGenerate" className="text-right">
                  Gerar Automaticamente
                </Label>
                <Switch
                  id="autoGenerate"
                  checked={preferences.autoGenerate}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, autoGenerate: checked })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSavePreferences} disabled={isSaving}>
                {isSaving ? "Salvando..." : "Salvar Preferências"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default CalendarPage;
