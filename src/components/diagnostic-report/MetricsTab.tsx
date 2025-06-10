
import React from 'react';
import { DiagnosticSession } from '@/hooks/useDiagnosticPersistence';
import { MetricsCards } from './metrics-tab/MetricsCards';
import { StrategicGoals } from './metrics-tab/StrategicGoals';
import { 
  generateCurrentMetrics, 
  generateProjectedMetrics
} from './metrics-tab/metricsData';

interface MetricsTabProps {
  session: DiagnosticSession;
}

const MetricsTab: React.FC<MetricsTabProps> = ({ session }) => {
  // Gerar métricas baseadas no perfil
  const currentMetrics = generateCurrentMetrics();
  const projectedMetrics = generateProjectedMetrics(currentMetrics);

  return (
    <div className="space-y-6">
      {/* Métricas Atuais vs Projetadas */}
      <MetricsCards 
        currentMetrics={currentMetrics}
        projectedMetrics={projectedMetrics}
      />

      {/* Objetivos e Metas */}
      <StrategicGoals />
    </div>
  );
};

export default MetricsTab;
