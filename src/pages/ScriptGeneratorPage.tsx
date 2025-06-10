
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FluidaScriptGenerator from '@/components/script-generator/FluidaScriptGenerator';
import SmartResultDisplay from '@/components/smart-script-generator/SmartResultDisplay';
import ScriptGeneratorTest from '@/components/ScriptGeneratorTest';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2, TestTube, ArrowLeft } from "lucide-react";
import { useActionHandlers } from './ScriptGeneratorPage/actionHandlers';

const ScriptGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const [approvedScript, setApprovedScript] = useState<any>(null);
  const { handleGenerateImage, handleGenerateVoice } = useActionHandlers();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleScriptApproved = (script: any) => {
    console.log('📝 Script aprovado:', script);
    setApprovedScript(script);
  };

  const handleApplyDisneyMagic = () => {
    if (!approvedScript) return;
    
    // Aplicar transformação Disney
    const disneyScript = {
      ...approvedScript,
      roteiro: approvedScript.roteiro.replace(/tratamento/g, 'jornada de transformação')
        .replace(/procedimento/g, 'ritual de beleza')
        .replace(/resultado/g, 'metamorfose')
        .replace(/cliente/g, 'pessoa especial'),
      emocao_central: 'encantamento',
      mentor: 'Fluida Encantadora'
    };
    
    setApprovedScript(disneyScript);
  };

  const handleNewScript = () => {
    setApprovedScript(null);
  };

  return (
    <div className="min-h-screen aurora-dark-bg relative overflow-hidden">
      {/* Aurora Particles Background */}
      <div className="aurora-particles">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="aurora-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header com botão voltar */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={handleGoBack}
            className="mb-6 aurora-glass border-purple-300/30 hover:border-purple-400/50 aurora-body text-white/90 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <div className="text-center">
            <h1 className="aurora-text-gradient text-4xl font-bold mb-4 flex items-center justify-center gap-3 relative z-10">
              <Wand2 className="h-10 w-10 text-purple-400 aurora-float aurora-glow" />
              FLUIDAROTEIRISTA
            </h1>
            <p className="aurora-body text-xl text-white/85 relative z-10">
              Roteiros criativos e impactantes para clínicas estéticas e médicas
            </p>
          </div>
        </div>

        {/* Resultado final com ações */}
        {approvedScript ? (
          <SmartResultDisplay
            generationResult={{
              content: approvedScript.roteiro,
              mentor: approvedScript.mentor,
              enigma: `Roteiro ${approvedScript.formato} com emoção ${approvedScript.emocao_central}`,
              intention: {
                tema: approvedScript.objetivo,
                tipo_conteudo: approvedScript.formato,
                objetivo: approvedScript.intencao,
                mentor_inferido: approvedScript.mentor,
                enigma_mentor: approvedScript.emocao_central,
                canal: 'instagram_feed',
                estilo_comunicacao: 'criativo'
              }
            }}
            onGenerateImage={handleGenerateImage}
            onGenerateVoice={handleGenerateVoice}
            onNewScript={handleNewScript}
            onApplyDisney={handleApplyDisneyMagic}
            onApproveScript={() => {}}
            isDisneyApplied={approvedScript.mentor === 'Fluida Encantadora'}
            isApproved={true}
            isProcessing={false}
          />
        ) : (
          <Tabs defaultValue="fluidaroteirista" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 aurora-glass border-purple-300/30">
              <TabsTrigger 
                value="fluidaroteirista" 
                className="flex items-center gap-2 aurora-body data-[state=active]:aurora-accent data-[state=active]:bg-purple-500/20 text-white/80 data-[state=active]:text-white"
              >
                <Wand2 className="h-4 w-4" />
                FLUIDAROTEIRISTA
              </TabsTrigger>
              <TabsTrigger 
                value="test" 
                className="flex items-center gap-2 aurora-body data-[state=active]:aurora-accent data-[state=active]:bg-purple-500/20 text-white/80 data-[state=active]:text-white"
              >
                <TestTube className="h-4 w-4" />
                Teste OpenAI
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="fluidaroteirista" className="mt-6">
              <FluidaScriptGenerator onScriptGenerated={handleScriptApproved} />
            </TabsContent>
            
            <TabsContent value="test" className="mt-6">
              <ScriptGeneratorTest />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default ScriptGeneratorPage;
