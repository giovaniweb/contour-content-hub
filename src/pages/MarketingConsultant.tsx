import React from 'react';
import { BrainCircuit } from 'lucide-react';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import MarketingConsultantHome from '@/components/marketing-consultant/MarketingConsultantHome';

const MarketingConsultant: React.FC = () => {
  const statusBadges = [
    {
      icon: BrainCircuit,
      label: 'IA Avançada',
      variant: 'secondary' as const,
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    }
  ];

  return (
    <AuroraPageLayout>
      <StandardPageHeader
        icon={BrainCircuit}
        title="Consultor de Marketing IA"
        subtitle="Seu assistente inteligente para estratégias de marketing"
        statusBadges={statusBadges}
      />
      
      <div className="container mx-auto px-6">
        <MarketingConsultantHome />
      </div>
    </AuroraPageLayout>
  );
};

export default MarketingConsultant;