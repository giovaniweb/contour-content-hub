
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
      color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    },
    {
      icon: Zap,
      label: 'Base Completa',
      variant: 'secondary' as const,
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    }
  ];

  return (
    <AuroraPageLayout>
      <StandardPageHeader
        icon={Sparkles}
        title="Mestre da Beleza 2.0"
        subtitle="IA Científica com Base Completa de Equipamentos e Estudos"
        statusBadges={statusBadges}
      />
      
      <div className="container mx-auto px-6">
        <AkinatorInteligente />
      </div>
    </AuroraPageLayout>
  );
};

export default MestreDaBelezaPage;
