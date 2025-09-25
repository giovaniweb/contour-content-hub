import React from 'react';
import { Navigate } from 'react-router-dom';
import { BrainCircuit, Sparkles, Zap } from 'lucide-react';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import MarketingConsultantHome from '@/components/marketing-consultant/MarketingConsultantHome';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';

const MarketingConsultant: React.FC = () => {
  const { hasAccess } = useFeatureAccess();

  if (!hasAccess('consultor_mkt')) {
    return <Navigate to="/dashboard" replace />;
  }
  const statusBadges = [
    {
      icon: Sparkles,
      label: 'IA Especializada',
      variant: 'secondary' as const,
      color: 'bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30'
    },
    {
      icon: Zap,
      label: 'Estratégias Personalizadas',
      variant: 'secondary' as const,
      color: 'bg-aurora-cyan/20 text-aurora-cyan border-aurora-cyan/30'
    }
  ];

  return (
    <AuroraPageLayout containerSize="lg" padding="sm" fullHeight>
      <StandardPageHeader
        icon={BrainCircuit}
        title="Consultor Fluida"
        subtitle="Sua central de inteligência em marketing para clínicas"
        statusBadges={statusBadges}
      />
      <MarketingConsultantHome />
    </AuroraPageLayout>
  );
};

export default MarketingConsultant;