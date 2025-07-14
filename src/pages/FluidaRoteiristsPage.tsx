
import React from 'react';
import { PenTool, Wand2, Sparkles } from 'lucide-react';
import FluidaRoteirista from '@/components/fluidaroteirista/FluidaRoteirista';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';

const FluidaRoteiristsPage: React.FC = () => {
  const statusBadges = [
    {
      icon: Wand2,
      label: 'IA Criativa',
      variant: 'secondary' as const,
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    },
    {
      icon: Sparkles,
      label: 'Roteiros Únicos',
      variant: 'secondary' as const,
      color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    }
  ];

  const handleScriptGenerated = (script: any) => {
    console.log('🎬 [FluidaRoteiristsPage] Script gerado:', script);
    // Aqui você pode adicionar lógica adicional se necessário
    // Por exemplo, navegar para outra página ou salvar o script
  };

  return (
    <AuroraPageLayout>
      <StandardPageHeader
        icon={PenTool}
        title="Fluida Roteirista"
        subtitle="Crie roteiros emocionais com inteligência artificial"
        statusBadges={statusBadges}
      />
      
      <div className="container mx-auto px-6">
        <FluidaRoteirista onScriptGenerated={handleScriptGenerated} />
      </div>
    </AuroraPageLayout>
  );
};

export default FluidaRoteiristsPage;
