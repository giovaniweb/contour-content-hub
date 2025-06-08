
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import GeneratingStep from '@/components/script-generator/GeneratingStep';
import SmartScriptGenerator from '@/components/smart-script-generator/SmartScriptGenerator';
import SmartResultDisplay from '@/components/smart-script-generator/SmartResultDisplay';
import ScriptGeneratorTest from '@/components/ScriptGeneratorTest';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, TestTube } from "lucide-react";
import { useScriptGeneration } from './ScriptGeneratorPage/useScriptGeneration';
import { useActionHandlers } from './ScriptGeneratorPage/actionHandlers';

type GeneratorMode = 'selection' | 'smart';

const ScriptGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const [generatorMode, setGeneratorMode] = useState<GeneratorMode>('smart');
  
  const {
    currentStep,
    intention,
    generatedResult,
    isGenerating,
    isDisneyMode,
    isApproved,
    handleThemeInput,
    applyDisneyMagic,
    approveScript,
    resetGeneration,
    setCurrentStep,
    setIntention
  } = useScriptGeneration();
  
  const { handleGenerateImage, handleGenerateVoice } = useActionHandlers();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleNewScriptWithSelection = () => {
    resetGeneration();
    setGeneratorMode('smart');
  };

  const renderGeneratorSelection = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">
          🎬 Gerador de Roteiros IA
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Sistema inteligente alimentado por OpenAI para criar roteiros profissionais
        </p>
      </div>
      
      <Tabs defaultValue="generator" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Gerador Inteligente
          </TabsTrigger>
          <TabsTrigger value="test" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Teste OpenAI
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator" className="mt-6">
          <Card className="border-2 hover:border-primary/50 transition-colors bg-gradient-to-br from-purple-900/10 to-blue-900/10">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">Gerador Inteligente OpenAI</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Sistema avançado baseado em OpenAI para gerar roteiros personalizados.
              </p>
              <Button 
                onClick={() => setGeneratorMode('smart')}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="lg"
              >
                <Bot className="h-4 w-4 mr-2" />
                Começar Geração IA
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="test" className="mt-6">
          <ScriptGeneratorTest />
        </TabsContent>
      </Tabs>
    </div>
  );

  console.log('🎬 ScriptGeneratorPage render - isGenerating:', isGenerating, 'generatedResult:', !!generatedResult);

  return (
    <Layout title="Gerador de Roteiros IA" fullWidth={false}>
      <div className="min-h-screen">
        {generatorMode === 'selection' && renderGeneratorSelection()}
        
        {generatorMode === 'smart' && (
          <>
            {/* Formulário de entrada */}
            {!isGenerating && !generatedResult && (
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
                <SmartScriptGenerator
                  onGenerate={handleThemeInput}
                  isGenerating={isGenerating}
                />
              </div>
            )}
            
            {/* Tela de processamento OpenAI */}
            {isGenerating && (
              <div className="container mx-auto px-4 py-8">
                <GeneratingStep />
              </div>
            )}
            
            {/* Resultado final */}
            {generatedResult && !isGenerating && (
              <SmartResultDisplay
                generationResult={generatedResult}
                onGenerateImage={handleGenerateImage}
                onGenerateVoice={handleGenerateVoice}
                onNewScript={handleNewScriptWithSelection}
                onApplyDisney={applyDisneyMagic}
                onApproveScript={approveScript}
                isDisneyApplied={isDisneyMode}
                isApproved={isApproved}
                isProcessing={isGenerating}
              />
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default ScriptGeneratorPage;
