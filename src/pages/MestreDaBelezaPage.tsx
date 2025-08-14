
import React from 'react';
import { Sparkles, Brain, Zap } from 'lucide-react';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import AkinatorInteligente from '@/components/mestre-da-beleza/AkinatorInteligente';

const MestreDaBelezaPage: React.FC = () => {
  const statusBadges = [
    {
      icon: Brain,
      label: 'IA Científica',
      variant: 'secondary' as const,
      color: 'bg-aurora-neon-blue/20 text-aurora-neon-blue border-aurora-neon-blue/30'
    },
    {
      icon: Zap,
      label: 'Base Completa',
      variant: 'secondary' as const,
      color: 'bg-aurora-cyan/20 text-aurora-cyan border-aurora-cyan/30'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-shrink-0">
        <StandardPageHeader
          icon={Sparkles}
          title="Mestre da Beleza 2.0"
          subtitle="IA Científica com Base Completa de Equipamentos e Estudos"
          statusBadges={statusBadges}
        />
      </div>
      <div className="flex-1 min-h-0">
        <AkinatorInteligente />
      </div>
    </div>
  );
};

export default MestreDaBelezaPage;
