
import React, { useState, useEffect } from 'react';
import { DiagnosticSession } from '@/hooks/useDiagnosticPersistence';
import { MetricsCards } from './metrics-tab/MetricsCards';
import { StrategicGoals } from './metrics-tab/StrategicGoals';
import { InstagramConnector } from './metrics-tab/InstagramConnector';
import { InstagramAnalysisComponent } from './metrics-tab/InstagramAnalysis';
import { 
  generateCurrentMetrics, 
  generateProjectedMetrics
} from './metrics-tab/metricsData';
import { 
  getLatestInstagramAnalytics, 
  isInstagramConnected,
  type InstagramAnalytics 
} from '@/services/instagramService';

interface MetricsTabProps {
  session: DiagnosticSession;
}

const MetricsTab: React.FC<MetricsTabProps> = ({ session }) => {
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [instagramData, setInstagramData] = useState<InstagramAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInstagramStatus();
  }, []);

  const loadInstagramStatus = async () => {
    try {
      const connected = await isInstagramConnected();
      setInstagramConnected(connected);
      
      if (connected) {
        const analytics = await getLatestInstagramAnalytics();
        setInstagramData(analytics);
      }
    } catch (error) {
      console.error('Error loading Instagram status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectionChange = async (connected: boolean) => {
    setInstagramConnected(connected);
    if (connected) {
      // Reload analytics data when connected
      const analytics = await getLatestInstagramAnalytics();
      setInstagramData(analytics);
    } else {
      setInstagramData(null);
    }
  };

  // Generate metrics - use real Instagram data if available, otherwise use simulated data
  const currentMetrics = instagramData 
    ? generateMetricsFromInstagram(instagramData)
    : generateCurrentMetrics();
  
  const projectedMetrics = generateProjectedMetrics(currentMetrics);

  return (
    <div className="space-y-6">
      {/* Instagram Integration */}
      <InstagramConnector onConnectionChange={handleConnectionChange} />

      {/* Métricas Atuais vs Projetadas */}
      <MetricsCards 
        currentMetrics={currentMetrics}
        projectedMetrics={projectedMetrics}
        isRealData={instagramConnected && instagramData !== null}
      />

      {/* Instagram Analysis */}
      <InstagramAnalysisComponent isConnected={instagramConnected} />

      {/* Objetivos e Metas */}
      <StrategicGoals />
    </div>
  );
};

// Helper function to convert Instagram data to metrics format
const generateMetricsFromInstagram = (instagramData: InstagramAnalytics) => {
  const followers = instagramData.followers_count || 0;
  const engagement = instagramData.engagement_rate || 0;
  const reach = instagramData.reach || 0;
  const leads = Math.floor(followers * 0.02); // Estimate leads based on followers

  return [
    {
      name: "Seguidores",
      current: followers.toLocaleString(),
      projected: Math.floor(followers * 1.5).toLocaleString(),
      growth: "+50%",
      icon: "Target",
      color: "text-blue-400"
    },
    {
      name: "Engajamento",
      current: `${engagement}%`,
      projected: `${(engagement * 1.3).toFixed(1)}%`,
      growth: "+30%",
      icon: "TrendingUp",
      color: "text-green-400"
    },
    {
      name: "Alcance",
      current: reach.toLocaleString(),
      projected: Math.floor(reach * 2).toLocaleString(),
      growth: "+100%",
      icon: "BarChart3",
      color: "text-purple-400"
    },
    {
      name: "Leads",
      current: leads.toString(),
      projected: Math.floor(leads * 2.5).toString(),
      growth: "+150%",
      icon: "Target",
      color: "text-orange-400"
    }
  ];
};

export default MetricsTab;
