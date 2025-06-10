
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import FluidaScriptGenerator from '@/components/script-generator/FluidaScriptGenerator';
import SmartResultDisplay from '@/components/smart-script-generator/SmartResultDisplay';
import ScriptGeneratorTest from '@/components/ScriptGeneratorTest';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2, TestTube, Sparkles } from "lucide-react";
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
    <Layout title="FLUIDAROTEIRISTA 🎬" fullWidth={false}>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={handleGoBack}
              className="mb-4"
            >
              ← Voltar
            </Button>
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
                  enigma_mentor: approvedScript.emocao_central
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
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="fluidaroteirista" className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4" />
                  FLUIDAROTEIRISTA
                </TabsTrigger>
                <TabsTrigger value="test" className="flex items-center gap-2">
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
    </Layout>
  );
};

export default ScriptGeneratorPage;
