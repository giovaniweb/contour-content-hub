
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, Eye } from "lucide-react";

const iconMap = {
  Heart,
  MessageCircle, 
  Share2,
  Eye
};

interface EngagementMetric {
  name: string;
  value: string;
  growth: string;
  icon: keyof typeof iconMap;
  color: string;
}

interface EngagementMetricsProps {
  metrics: EngagementMetric[];
}

export const EngagementMetrics: React.FC<EngagementMetricsProps> = ({ metrics }) => {
  return (
    <Card className="aurora-card border-aurora-turquoise/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Heart className="h-5 w-5 text-aurora-turquoise" />
          Engajamento (30 dias)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => {
            const IconComponent = iconMap[metric.icon];
            return (
              <Card key={index} className="aurora-glass border-white/10">
                <CardContent className="p-4 text-center">
                  <IconComponent className={`h-6 w-6 mx-auto mb-2 ${metric.color}`} />
                  <div className="text-lg font-bold text-foreground">{metric.value}</div>
                  <div className="text-xs text-foreground/60 mb-1">{metric.name}</div>
                  <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs">
                    {metric.growth}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
