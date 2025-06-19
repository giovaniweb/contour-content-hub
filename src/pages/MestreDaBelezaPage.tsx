
import React from 'react';
import { Sparkles, Wand2, Star } from 'lucide-react';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import AkinatorMagico from '@/components/mestre-da-beleza/AkinatorMagico';

const MestreDaBelezaPage: React.FC = () => {
  const statusBadges = [
    {
      icon: Wand2,
      label: 'Mágico',
      variant: 'secondary' as const,
      color: 'bg-pink-500/20 text-pink-400 border-pink-500/30'
    },
    {
      icon: Star,
      label: 'Experiência',
      variant: 'secondary' as const,
      color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    }
  ];

  return (
    <AuroraPageLayout>
      <StandardPageHeader
        icon={Sparkles}
        title="Mestre da Beleza"
        subtitle="Descoberta mágica de equipamentos e tratamentos"
        statusBadges={statusBadges}
      />
      
      <div className="container mx-auto px-6">
        <AkinatorMagico />
      </div>
    </AuroraPageLayout>
  );
};

export default MestreDaBelezaPage;
