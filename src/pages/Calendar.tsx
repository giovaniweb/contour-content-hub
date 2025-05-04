import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getCalendarSuggestions, updateCalendarCompletion, clearCalendarPlanning } from '@/utils/api';
import { CalendarSuggestion } from '@/utils/api';
import { useUser } from '@/hooks/useUser';

const CalendarPage: React.FC = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [suggestions, setSuggestions] = useState<CalendarSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isLoading: isUserLoading } = useUser();
  
  // Ensure user is loaded before fetching suggestions
  useEffect(() => {
    if (!isUserLoading && user) {
      fetchSuggestions();
    }
  }, [date, user, isUserLoading]);

  const fetchSuggestions = async () => {
    if (!user || !date) return;
    
    try {
      setLoading(true);
      const formattedDate = date.toISOString().split('T')[0];
      const fetchedSuggestions = await getCalendarSuggestions(formattedDate);
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

  const handleCompletionToggle = async (id: string, completed: boolean) => {
    try {
      await updateCalendarCompletion(id, completed);
      setSuggestions(suggestions.map(s => s.id === id ? { ...s, completed } : s));
      
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
      const userId = user.id;
      await clearCalendarPlanning(userId); // Add userId parameter
      setSuggestions([]);
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

  return (
    <Layout title="Calendário de Conteúdo">
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Calendário de Conteúdo</h1>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? date?.toLocaleDateString() : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center" side="bottom">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) =>
                  date > new Date() || date < new Date("2023-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {loading ? (
          <p>Carregando sugestões...</p>
        ) : (
          <div className="space-y-4">
            {suggestions.length > 0 ? (
              suggestions.map(suggestion => (
                <div key={suggestion.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-semibold">{suggestion.title}</h2>
                      <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                      <p className="text-xs text-gray-500">Formato: {suggestion.format}</p>
                    </div>
                    <Button 
                      variant={suggestion.completed ? "secondary" : "outline"}
                      onClick={() => handleCompletionToggle(suggestion.id || '', !suggestion.completed)}
                    >
                      {suggestion.completed ? 'Concluído' : 'Marcar como Concluído'}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <h2 className="text-xl font-semibold mb-2">Nenhum conteúdo planejado para este dia</h2>
                <p className="text-muted-foreground">
                  Comece a planejar seu conteúdo para bombar nas redes sociais!
                </p>
              </div>
            )}
            
            {suggestions.length > 0 && (
              <Button variant="destructive" onClick={handleClearPlanning} disabled={loading}>
                Limpar Planejamento
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CalendarPage;
