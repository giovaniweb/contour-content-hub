import React from 'react';
import ApprovedScriptsManager from '@/components/approved-scripts/ApprovedScriptsManager';
import { Check } from "lucide-react";
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
const ApprovedScriptsPage: React.FC = () => {
  const statusBadges = [
    {
      icon: Check,
      label: 'Aprovados',
      variant: 'secondary' as const,
      color: 'bg-aurora-emerald/20 text-aurora-emerald border-aurora-emerald/30'
    }
  ];

  return (
    <AuroraPageLayout>
      <StandardPageHeader
        icon={Check}
        title="Biblioteca de Roteiros Aprovados"
        subtitle="Gerencie, avalie desempenho e envie roteiros aprovados para o planejador de conteúdo"
        statusBadges={statusBadges}
      />
      <div className="aurora-glass rounded-3xl border border-aurora-electric-purple/30 p-8">
        <ApprovedScriptsManager />
      </div>
    </AuroraPageLayout>
  );
};
export default ApprovedScriptsPage;