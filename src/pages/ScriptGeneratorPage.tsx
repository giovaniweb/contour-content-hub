import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import GeneratingStep from '@/components/script-generator/GeneratingStep';
import SmartScriptGenerator from '@/components/smart-script-generator/SmartScriptGenerator';
import SmartResultDisplay from '@/components/smart-script-generator/SmartResultDisplay';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { useSmartScriptGeneration } from './ScriptGeneratorPage/useSmartScriptGeneration';
import { useActionHandlers } from './ScriptGeneratorPage/actionHandlers';

type GeneratorMode = 'selection' | 'smart';

const ScriptGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const [generatorMode, setGeneratorMode] = useState<GeneratorMode>('smart');
  
  const {
    currentStep,
    generatedResult,
    isGenerating,
    isDisneyMode,
    isApproved,
    applyDisneyMagic,
    approveScript,
    resetGeneration
  } = useSmartScriptGeneration();
  
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
          🎬 Gerador de Roteiros
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Sistema inteligente para criar roteiros profissionais com IA
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Gerador Inteligente</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Sistema avançado baseado em IA para gerar roteiros personalizados com análise estruturada e validação automática.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Análise de intenção automática</li>
              <li>• Seleção inteligente de mentor</li>
              <li>• Prompts dinâmicos personalizados</li>
              <li>• Validação emocional Disney</li>
            </ul>
            <Button 
              onClick={() => setGeneratorMode('smart')}
              className="w-full"
              size="lg"
            >
              <Bot className="h-4 w-4 mr-2" />
              Começar a criar roteiro
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <Layout title="Gerador de Roteiros" fullWidth={false}>
      <div className="min-h-screen">
        {generatorMode === 'selection' && renderGeneratorSelection()}
        
        {generatorMode === 'smart' && (
          <>
            {/* Mostrar formulário apenas se não estiver gerando e não tiver resultado */}
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
                  onGenerate={() => {}} // Não usado mais - lógica interna
                  isGenerating={isGenerating}
                />
              </div>
            )}
            
            {/* Mostrar tela de progresso quando estiver gerando */}
            {isGenerating && (
              <div className="container mx-auto px-4 py-8">
                <GeneratingStep />
              </div>
            )}
            
            {/* Mostrar resultado quando tiver resultado e não estiver gerando */}
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
