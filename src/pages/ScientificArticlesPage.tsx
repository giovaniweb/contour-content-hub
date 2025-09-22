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
      label: 'Artigos Científicos',
      variant: 'secondary' as const,
      color: 'bg-aurora-cyan/20 text-aurora-cyan border-aurora-cyan/30'
    }
  ];

  return (
    <AuroraPageLayout>
      <StandardPageHeader
        icon={FileText}
        title="FluiArtigos"
        subtitle="Base de conhecimento científico completa"
        statusBadges={statusBadges}
      />
      
      <div className="container mx-auto px-6 py-8">
        <ScientificArticlesUserManager />
      </div>
    </AuroraPageLayout>
  );
};

export default ScientificArticlesPage;