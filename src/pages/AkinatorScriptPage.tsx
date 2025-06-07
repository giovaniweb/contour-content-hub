
import React from 'react';
import Layout from '@/components/Layout';
import AkinatorScriptGenerator from '@/components/akinator-script-generator/AkinatorScriptGenerator';

const AkinatorScriptPage: React.FC = () => {
  return (
    <Layout title="Roteirista Akinator" fullWidth={false}>
      <div className="container mx-auto px-4 py-8">
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
    </Layout>
  );
};

export default AkinatorScriptPage;
