
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
      color: 'bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30'
    },
    {
      icon: Sparkles,
      label: 'Roteiros Pro',
      variant: 'secondary' as const,
      color: 'bg-aurora-cyan/20 text-aurora-cyan border-aurora-cyan/30'
    }
  ];

  const handleScriptGenerated = (script: any) => {
    console.log('🎬 [FluidaRoteiristsPage] Script gerado:', script);
  };

  return (
    <AuroraPageLayout containerSize="lg" padding="sm">
      <StandardPageHeader
        icon={PenTool}
        title="Fluida Roteirista"
        subtitle="IA Criativa para Roteiros Únicos"
        statusBadges={statusBadges}
      />
      <FluidaRoteirista onScriptGenerated={handleScriptGenerated} />
    </AuroraPageLayout>
  );
};

export default FluidaRoteiristsPage;
