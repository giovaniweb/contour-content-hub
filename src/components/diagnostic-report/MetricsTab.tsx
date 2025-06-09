
import React from 'react';
import { DiagnosticSession } from '@/hooks/useDiagnosticPersistence';
import { MetricsCards } from './metrics-tab/MetricsCards';
import { KPISection } from './metrics-tab/KPISection';
import { EngagementMetrics } from './metrics-tab/EngagementMetrics';
import { StrategicGoals } from './metrics-tab/StrategicGoals';
import { 
  generateCurrentMetrics, 
  generateProjectedMetrics, 
  kpis, 
  engagementMetrics 
} from './metrics-tab/metricsData';

interface MetricsTabProps {
  session: DiagnosticSession;
}

const MetricsTab: React.FC<MetricsTabProps> = ({ session }) => {
  // Simular métricas baseadas no perfil
  const currentMetrics = generateCurrentMetrics();
  const projectedMetrics = generateProjectedMetrics(currentMetrics);

  return (
    <div className="space-y-6">
      {/* Métricas Atuais vs Projetadas */}
      <MetricsCards 
        currentMetrics={currentMetrics}
        projectedMetrics={projectedMetrics}
      />

      {/* KPIs Principais */}
      <KPISection kpis={kpis} />

      {/* Métricas de Engajamento */}
      <EngagementMetrics metrics={engagementMetrics} />

      {/* Objetivos e Metas */}
      <StrategicGoals />
    </div>
  );
};

export default MetricsTab;
