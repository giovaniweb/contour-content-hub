import React from 'react';
import { FileText, Sparkles, Brain } from 'lucide-react';
import ScientificArticlesUserManager from '@/components/scientific-articles/ScientificArticlesUserManager';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';

const ScientificArticlesPage: React.FC = () => {
  const statusBadges = [
    {
      icon: Brain,
      label: 'Base Científica',
      variant: 'secondary' as const,
      color: 'bg-aurora-neon-blue/20 text-aurora-neon-blue border-aurora-neon-blue/30'
    },
    {
      icon: Sparkles,
      label: 'Pesquisas Avançadas',
      variant: 'secondary' as const,
      color: 'bg-aurora-cyan/20 text-aurora-cyan border-aurora-cyan/30'
    }
  ];

  return (
    <AuroraPageLayout containerSize="lg" padding="sm">
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