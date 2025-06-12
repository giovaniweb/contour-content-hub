
import React from 'react';
import FluidaRoteirista from '@/components/fluidaroteirista/FluidaRoteirista';

const FluidaRoteiristPage: React.FC = () => {
  const handleScriptGenerated = (script: any) => {
    console.log('🎬 [FluidaRoteiristPage] Script gerado:', script);
    // Aqui você pode adicionar lógica adicional se necessário
    // Por exemplo, navegar para outra página ou salvar o script
  };

  return <FluidaRoteirista onScriptGenerated={handleScriptGenerated} />;
};

export default FluidaRoteiristPage;
