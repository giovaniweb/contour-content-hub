
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import CustomGptForm from '@/components/CustomGptForm';
import { Sparkles, Wand, BrainCircuit, Calendar } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ScriptCard from '@/components/ScriptCard';
import { ScriptResponse, generatePDF, linkScriptToCalendar } from '@/utils/api';
import CalendarDialog from '@/components/script/CalendarDialog';
import { useToast } from '@/hooks/use-toast';

const CustomGpt: React.FC = () => {
  const [generatedScript, setGeneratedScript] = useState<ScriptResponse | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Gerador de Conteúdo | Fluida";
  }, []);

  const handleScriptGenerated = (script: ScriptResponse) => {
    setGeneratedScript(script);
  };

  const handleScriptApprove = async () => {
    if (!generatedScript) return;
    
    try {
      // When script is approved, automatically show the calendar
      setShowCalendar(true);
      
      // Open calendar dialog
      setCalendarDialogOpen(true);
      
      return Promise.resolve();
    } catch (error) {
      console.error("Erro ao aprovar roteiro:", error);
      toast({
        variant: "destructive",
        title: "Erro ao aprovar roteiro",
        description: "Não foi possível aprovar o roteiro",
      });
      return Promise.reject(error);
    }
  };
  
  const handleScriptReject = async (scriptId: string) => {
    try {
      // Reset to form view when script is rejected
      setGeneratedScript(null);
      toast({
        title: "Roteiro rejeitado",
        description: "Uma nova versão será gerada",
      });
      return Promise.resolve();
    } catch (error) {
      console.error("Erro ao rejeitar roteiro:", error);
      toast({
        variant: "destructive",
        title: "Erro ao rejeitar roteiro",
        description: "Não foi possível rejeitar o roteiro",
      });
      return Promise.reject(error);
    }
  };
  
  const handleScheduleScript = async (date: Date | undefined, timeSlot: string) => {
    if (!generatedScript || !date) return;
    
    try {
      // Create a calendar event ID (in a real app this would come from the database)
      const eventId = `event-${Date.now()}`;
      
      // Link script to calendar
      await linkScriptToCalendar(generatedScript.id, eventId);
      
      // Format date for display
      const formattedDate = date.toLocaleDateString('pt-BR');
      const periodMap: Record<string, string> = {
        morning: "manhã",
        noon: "meio-dia",
        afternoon: "tarde",
        evening: "noite"
      };
      
      toast({
        title: "Roteiro agendado",
        description: `O conteúdo foi agendado para ${formattedDate} no período da ${periodMap[timeSlot]}.`,
      });
      
      // Close calendar dialog
      setCalendarDialogOpen(false);
    } catch (error) {
      console.error("Erro ao agendar roteiro:", error);
      toast({
        variant: "destructive",
        title: "Erro ao agendar roteiro",
        description: "Não foi possível agendar o roteiro",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Sparkles className="h-8 w-8 mr-2 text-blue-500" />
            <h1 className="text-2xl font-bold">Gerador de Conteúdo Avançado</h1>
          </div>
          <Link to="/equipment-details">
            <Button variant="outline" size="sm" className="flex items-center">
              <Wand className="h-4 w-4 mr-2" />
              Verificar Equipamentos
            </Button>
          </Link>
        </div>
        
        <p className="text-muted-foreground mb-6">
          Gere roteiros, big ideas e stories para equipamentos estéticos usando o assistente de IA avançado.
        </p>
        
        <Alert className="mb-6">
          <BrainCircuit className="h-4 w-4" />
          <AlertTitle>Assistente Unificado com Validação Inteligente</AlertTitle>
          <AlertDescription>
            Este gerador combina as melhores funcionalidades da Fluida e do Gerador de Roteiros.
            Cada conteúdo gerado pode ser validado com GPT-4o para análise de gancho, clareza, CTA e conexão emocional,
            aprovado e adicionado ao seu calendário de conteúdo.
          </AlertDescription>
        </Alert>
        
        {!generatedScript ? (
          <Tabs defaultValue="fluida" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="fluida">Fluida</TabsTrigger>
              <TabsTrigger value="roteiro">Roteiro Avançado</TabsTrigger>
            </TabsList>
            
            <TabsContent value="fluida">
              <CustomGptForm mode="simple" onScriptGenerated={handleScriptGenerated} />
            </TabsContent>
            
            <TabsContent value="roteiro">
              <CustomGptForm mode="advanced" onScriptGenerated={handleScriptGenerated} />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-6">
            <ScriptCard 
              script={generatedScript} 
              onApprove={handleScriptApprove}
              onReject={handleScriptReject}
            />
            
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setGeneratedScript(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
              >
                Gerar Novo Conteúdo
              </button>
            </div>
          </div>
        )}
        
        <CalendarDialog 
          open={calendarDialogOpen}
          onOpenChange={setCalendarDialogOpen}
          onSchedule={handleScheduleScript}
          scriptId={generatedScript?.id || ""}
        />
      </div>
    </Layout>
  );
};

export default CustomGpt;
