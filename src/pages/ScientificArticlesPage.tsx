import React from 'react';
import { FileText, Sparkles, Brain } from 'lucide-react';
import ScientificArticlesUserManager from '@/components/scientific-articles/ScientificArticlesUserManager';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';

const ScientificArticlesPage: React.FC = () => {
  const statusBadges = [
    {
      icon: Brain,
      label: 'Científico',
      variant: 'secondary' as const,
      color: 'bg-aurora-neon-blue/20 text-aurora-neon-blue border-aurora-neon-blue/30'
    },
    {
      icon: Sparkles,
      label: 'Estudos',
      variant: 'secondary' as const,
      color: 'bg-aurora-emerald/20 text-aurora-emerald border-aurora-emerald/30'
    }
  ];

  return (
    <AuroraPageLayout>
      <StandardPageHeader
        icon={FileText}
        title="Artigos Científicos"
        subtitle="Base de conhecimento científico completa"
        statusBadges={statusBadges}
      />
      <ScientificArticlesUserManager />
    </AuroraPageLayout>
  );
};

export default ScientificArticlesPage;