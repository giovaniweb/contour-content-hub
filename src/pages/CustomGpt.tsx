
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import CustomGptForm from '@/components/CustomGptForm';
import { Sparkles, Wand, BrainCircuit, Calendar, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CustomGpt: React.FC = () => {
  useEffect(() => {
    document.title = "Gerador de Conteúdo | Reelline";
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Sparkles className="h-8 w-8 mr-2 text-blue-500" />
          <h1 className="text-2xl font-bold">Gerador de Conteúdo Avançado</h1>
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
        
        <Tabs defaultValue="gptPersonalizado" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="gptPersonalizado">GPT Personalizado</TabsTrigger>
            <TabsTrigger value="roteiro">Roteiro Avançado</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gptPersonalizado">
            <CustomGptForm mode="simple" />
          </TabsContent>
          
          <TabsContent value="roteiro">
            <CustomGptForm mode="advanced" />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CustomGpt;
