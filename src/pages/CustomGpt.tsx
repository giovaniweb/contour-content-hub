import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import CustomGptForm from '@/components/CustomGptForm';
import { Sparkles, Wand, BrainCircuit, Calendar, Check, ThumbsUp, FileSearch } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ScriptCard from '@/components/ScriptCard';
import { ScriptResponse } from '@/utils/api';

const CustomGpt: React.FC = () => {
  const [generatedScript, setGeneratedScript] = useState<ScriptResponse | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    document.title = "Gerador de Conteúdo | Reelline";
  }, []);

  const handleScriptGenerated = (script: ScriptResponse) => {
    setGeneratedScript(script);
  };

  const handleScriptApprove = async () => {
    // When script is approved, automatically show the calendar
    setShowCalendar(true);
  };
  
  const handleScriptReject = async () => {
    // Reset to form view when script is rejected
    setGeneratedScript(null);
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
              <FileSearch className="h-4 w-4 mr-2" />
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
            Este gerador combina as melhores funcionalidades do GPT Personalizado e do Gerador de Roteiros.
            Cada conteúdo gerado pode ser validado com GPT-4o para análise de gancho, clareza, CTA e conexão emocional,
            aprovado e adicionado ao seu calendário de conteúdo.
          </AlertDescription>
        </Alert>
        
        {!generatedScript ? (
          <Tabs defaultValue="gptPersonalizado" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="gptPersonalizado">GPT Personalizado</TabsTrigger>
              <TabsTrigger value="roteiro">Roteiro Avançado</TabsTrigger>
            </TabsList>
            
            <TabsContent value="gptPersonalizado">
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
      </div>
    </Layout>
  );
};

export default CustomGpt;
