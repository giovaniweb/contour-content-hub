
import React from "react";
import { Calendar, Sparkles, Zap } from "lucide-react";
import ContentPlannerComponent from '@/components/content-planner/ContentPlanner';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';

const ContentPlannerPage: React.FC = () => {
  const statusBadges = [
    {
      icon: Sparkles,
      label: 'Planejamento',
      variant: 'secondary' as const,
      color: 'bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30'
    },
    {
      icon: Zap,
      label: 'Estratégico',
      variant: 'secondary' as const,
      color: 'bg-aurora-cyan/20 text-aurora-cyan border-aurora-cyan/30'
    }
  ];

  return (
    <AuroraPageLayout containerSize="lg" padding="sm">
      <StandardPageHeader
        icon={Calendar}
        title="Planner de Conteúdo"
        subtitle="Organize e planeje seu conteúdo de forma estratégica"
        statusBadges={statusBadges}
      />
      <ContentPlannerComponent />
    </AuroraPageLayout>
  );
};

export default ContentPlannerPage;
