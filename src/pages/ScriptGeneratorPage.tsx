
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import GeneratingStep from '@/components/script-generator/GeneratingStep';
import SmartScriptGenerator from '@/components/smart-script-generator/SmartScriptGenerator';
import SmartResultDisplay from '@/components/smart-script-generator/SmartResultDisplay';
import { useScriptGeneration } from './ScriptGeneratorPage/useScriptGeneration';
import { useActionHandlers } from './ScriptGeneratorPage/actionHandlers';

const ScriptGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
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

  return (
    <Layout title="Gerador de Roteiros" fullWidth={false}>
      <div className="container mx-auto px-4 py-8 min-h-screen">
        {step === 'smartInput' && (
          <SmartScriptGenerator
            onGenerate={handleSmartGenerate}
            isGenerating={false}
          />
        )}
        
        {step === 'generating' && <GeneratingStep />}
        
        {step === 'smartResult' && generationData && generatedContent && (
          <SmartResultDisplay
            generationData={generationData}
            generatedContent={generatedContent}
            onGenerateImage={handleGenerateImage}
            onGenerateVoice={handleGenerateVoice}
            onNewScript={handleNewScript}
          />
        )}
      </div>
    </Layout>
  );
};

export default ScriptGeneratorPage;
