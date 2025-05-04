
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import CustomGptForm from '@/components/CustomGptForm';
import { Sparkles, Wand, BrainCircuit } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ScriptCard from '@/components/ScriptCard';
import { ScriptResponse } from '@/types/script';
import CalendarDialog from '@/components/script/CalendarDialog';
import { useToast } from '@/hooks/use-toast';

// Add missing type
export interface ScriptResponse {
  id: string;
  title: string;
  content: string;
  type: 'videoScript' | 'bigIdea' | 'dailySales';
  createdAt: string;
  suggestedVideos: any[];
  captionTips: any[];
  equipment?: string;
  marketingObjective?: string;
}

const CustomGpt: React.FC = () => {
  const location = useLocation();
  const [generatedScript, setGeneratedScript] = useState<ScriptResponse | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false);
  const [initialFormData, setInitialFormData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("fluida"); // Default tab
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Gerador de Conteúdo | Fluida";
    
    // Parse query parameters to pre-fill form
    const params = new URLSearchParams(location.search);
    
    // Set active tab based on mode parameter (advanced or simple)
    const mode = params.get('mode');
    if (mode === 'advanced') {
      setActiveTab('roteiro');
    }
    
    const formData: any = {};
    
    if (params.get('topic')) formData.topic = params.get('topic');
    if (params.get('equipment')) formData.equipamento = params.get('equipment');
    if (params.get('purpose')) formData.purposes = [params.get('purpose')];
    if (params.get('bodyArea')) formData.bodyArea = params.get('bodyArea');
    if (params.get('objective')) formData.marketingObjective = params.get('objective');
    if (params.get('additionalInfo')) formData.additionalInfo = params.get('additionalInfo');
    
    // Only set initial form data if we have at least one parameter
    if (Object.keys(formData).length > 0) {
      setInitialFormData(formData);
      
      toast({
        title: "Dados pré-preenchidos",
        description: "O formulário foi preenchido automaticamente com base no tema selecionado.",
      });
    }
  }, [location, toast]);

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
  
  const handleScheduleScript = async (date: Date, timeSlot: string) => {
    if (!generatedScript || !date) return;
    
    try {
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
    <Layout title="Media Library">
      <div className="space-y-8">
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
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="fluida">Fluida</TabsTrigger>
              <TabsTrigger value="roteiro">Roteiro Avançado</TabsTrigger>
            </TabsList>
            
            <TabsContent value="fluida">
              <CustomGptForm 
                onScriptGenerated={handleScriptGenerated} 
                initialData={initialFormData}
                mode="simple"
              />
            </TabsContent>
            
            <TabsContent value="roteiro">
              <CustomGptForm 
                onScriptGenerated={handleScriptGenerated} 
                initialData={initialFormData}
                mode="advanced"
              />
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
              <Button
                onClick={() => setGeneratedScript(null)}
                variant="outline"
              >
                Gerar Novo Conteúdo
              </Button>
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
