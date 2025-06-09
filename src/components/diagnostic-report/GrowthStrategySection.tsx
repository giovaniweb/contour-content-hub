
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";
import { DiagnosticSession } from '@/hooks/useDiagnosticPersistence';
import { WeekCard } from './growth-strategy/WeekCard';
import { ProgressTracker } from './growth-strategy/ProgressTracker';
import { growthWeeks } from './growth-strategy/strategyData';

interface GrowthStrategySectionProps {
  session: DiagnosticSession;
}

const GrowthStrategySection: React.FC<GrowthStrategySectionProps> = ({ session }) => {
  const getMainSpecialty = () => {
    if (session.state.clinicType === 'clinica_medica') {
      return session.state.medicalSpecialty || 'Medicina';
    }
    return session.state.aestheticFocus || 'Estética';
  };

  return (
    <Card className="aurora-card border-aurora-lavender/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Lightbulb className="h-5 w-5 text-aurora-lavender" />
          Estratégia de Crescimento - {getMainSpecialty()}
          <Badge variant="outline" className="border-aurora-lavender/30 text-aurora-lavender">
            4 Semanas
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Strategy weeks */}
        <div className="space-y-6">
          {growthWeeks.map((week, index) => (
            <WeekCard key={week.week} week={week} />
          ))}
        </div>
        
        {/* Progress tracking */}
        <ProgressTracker />
      </CardContent>
    </Card>
  );
};

export default GrowthStrategySection;
