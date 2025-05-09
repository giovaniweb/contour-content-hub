
import React from 'react';
import InsightCard from './InsightCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { layouts } from '@/lib/design-system';

const InsightsSection: React.FC = () => {
  // Top performing content types
  const contentPerformance = [
    { type: 'Vídeos demonstrativos', percentage: 68 },
    { type: 'Antes e depois', percentage: 57 },
    { type: 'Depoimentos', percentage: 45 },
    { type: 'Tutoriais', percentage: 38 },
    { type: 'Artigos técnicos', percentage: 27 },
  ];

  // Popular search terms
  const searchTerms = [
    "tratamento facial",
    "rejuvenescimento",
    "ultralift",
    "adella laser",
    "resultados antes e depois",
    "hipro",
    "equipamentos estética",
    "tutorial aplicação"
  ];

  // Distribution platforms
  const platforms = [
    { name: 'Instagram', value: 42, color: 'bg-pink-500' },
    { name: 'TikTok', value: 26, color: 'bg-black' },
    { name: 'YouTube', value: 19, color: 'bg-red-600' },
    { name: 'LinkedIn', value: 8, color: 'bg-blue-700' },
    { name: 'Facebook', value: 5, color: 'bg-blue-600' },
  ];

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-6">Insights de Performance</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top performing content types */}
        <InsightCard
          title="Conteúdos com Maior Engajamento"
          description="Tipos de conteúdo com melhor performance"
        >
          <ScrollArea className="h-80 pr-4">
            <div className="space-y-4">
              {contentPerformance.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.type}</span>
                    <span className="font-medium">{item.percentage}%</span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </InsightCard>

        {/* Popular search terms */}
        <InsightCard
          title="Termos mais buscados"
          description="O que os usuários estão procurando"
        >
          <div className="flex flex-wrap gap-2 pt-2">
            {searchTerms.map((term, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {term}
              </Badge>
            ))}
          </div>
        </InsightCard>

        {/* Distribution platforms */}
        <InsightCard
          title="Canais de Distribuição"
          description="Onde seu conteúdo está sendo compartilhado"
        >
          <div className="space-y-4 pt-2">
            {platforms.map((platform, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{platform.name}</span>
                  <span className="font-medium">{platform.value}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full ${platform.color}`}
                    style={{ width: `${platform.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </InsightCard>
      </div>
    </div>
  );
};

export default InsightsSection;
