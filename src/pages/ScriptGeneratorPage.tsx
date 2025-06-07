
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import GeneratingStep from '@/components/script-generator/GeneratingStep';
import SmartScriptGenerator from '@/components/smart-script-generator/SmartScriptGenerator';
import SmartResultDisplay from '@/components/smart-script-generator/SmartResultDisplay';
import AkinatorScriptGenerator from '@/components/akinator-script-generator/AkinatorScriptGenerator';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wand2, Sparkles, Bot } from "lucide-react";
import { useScriptGeneration } from './ScriptGeneratorPage/useScriptGeneration';
import { useActionHandlers } from './ScriptGeneratorPage/actionHandlers';

type GeneratorMode = 'selection' | 'smart' | 'akinator';

const ScriptGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const [generatorMode, setGeneratorMode] = useState<GeneratorMode>('selection');
  
  const {
    step,
    generationData,
    generatedContent,
    handleSmartGenerate,
    handleNewScript
  } = useScriptGeneration();
  
  const { handleGenerateImage, handleGenerateVoice } = useActionHandlers();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleNewScriptWithSelection = () => {
    handleNewScript();
    setGeneratorMode('selection');
  };

  const renderGeneratorSelection = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">
          🎬 Gerador de Roteiros
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Escolha o estilo de geração que mais combina com você
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
        <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer group">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Gerador Inteligente</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Sistema avançado baseado em IA para gerar roteiros personalizados com análise estruturada e validação automática.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Análise de objetivos de marketing</li>
              <li>• Validação estrutural automática</li>
              <li>• Múltiplos formatos de conteúdo</li>
            </ul>
            <Button 
              onClick={() => setGeneratorMode('smart')}
              className="w-full"
            >
              <Bot className="h-4 w-4 mr-2" />
              Usar Gerador Inteligente
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer group">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
              <Sparkles className="h-8 w-8 text-purple-500" />
            </div>
            <CardTitle className="text-xl">Roteirista Akinator</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Como o Akinator, vou adivinhar exatamente o tipo de roteiro que você precisa através de perguntas inteligentes.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Experiência interativa guiada</li>
              <li>• Seleção automática de mentor</li>
              <li>• Estrutura Disney opcional</li>
            </ul>
            <Button 
              onClick={() => setGeneratorMode('akinator')}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Usar Roteirista Akinator
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
            {step === 'smartInput' && (
              <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                  <Button 
                    variant="ghost" 
                    onClick={() => setGeneratorMode('selection')}
                    className="mb-4"
                  >
                    ← Voltar para seleção
                  </Button>
                </div>
                <SmartScriptGenerator
                  onGenerate={handleSmartGenerate}
                  isGenerating={false}
                />
              </div>
            )}
            
            {step === 'generating' && <GeneratingStep />}
            
            {step === 'smartResult' && generationData && generatedContent && (
              <SmartResultDisplay
                generationData={generationData}
                generatedContent={generatedContent}
                onGenerateImage={handleGenerateImage}
                onGenerateVoice={handleGenerateVoice}
                onNewScript={handleNewScriptWithSelection}
              />
            )}
          </>
        )}
        
        {generatorMode === 'akinator' && (
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <Button 
                variant="ghost" 
                onClick={() => setGeneratorMode('selection')}
                className="mb-4"
              >
                ← Voltar para seleção
              </Button>
            </div>
            
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">
                🔮 Roteirista Akinator
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Como o Akinator, vou adivinhar exatamente o tipo de roteiro que você precisa. 
                Responda às perguntas e deixe a magia acontecer!
              </p>
            </div>
            
            <AkinatorScriptGenerator />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ScriptGeneratorPage;
