import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Circle, 
  Building, 
  Target, 
  DollarSign, 
  Users,
  MessageSquare,
  TrendingUp
} from "lucide-react";

interface ProgressStep {
  id: string;
  title: string;
  icon: React.ReactNode;
  status: 'completed' | 'current' | 'pending';
}

interface ProgressTrackerProps {
  currentPhase: string;
  completedSteps: string[];
  totalProgress: number;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  currentPhase,
  completedSteps,
  totalProgress
}) => {
  const phases: ProgressStep[] = [
    {
      id: 'clinic-type',
      title: 'Tipo de Clínica',
      icon: <Building className="w-4 h-4" />,
      status: completedSteps.includes('clinic-type') ? 'completed' : 
              currentPhase === 'clinic-type' ? 'current' : 'pending'
    },
    {
      id: 'objectives',
      title: 'Objetivos',
      icon: <Target className="w-4 h-4" />,
      status: completedSteps.includes('objectives') ? 'completed' : 
              currentPhase === 'objectives' ? 'current' : 'pending'
    },
    {
      id: 'financials',
      title: 'Financeiro',
      icon: <DollarSign className="w-4 h-4" />,
      status: completedSteps.includes('financials') ? 'completed' : 
              currentPhase === 'financials' ? 'current' : 'pending'
    },
    {
      id: 'audience',
      title: 'Público-Alvo',
      icon: <Users className="w-4 h-4" />,
      status: completedSteps.includes('audience') ? 'completed' : 
              currentPhase === 'audience' ? 'current' : 'pending'
    },
    {
      id: 'communication',
      title: 'Comunicação',
      icon: <MessageSquare className="w-4 h-4" />,
      status: completedSteps.includes('communication') ? 'completed' : 
              currentPhase === 'communication' ? 'current' : 'pending'
    },
    {
      id: 'challenges',
      title: 'Desafios',
      icon: <TrendingUp className="w-4 h-4" />,
      status: completedSteps.includes('challenges') ? 'completed' : 
              currentPhase === 'challenges' ? 'current' : 'pending'
    }
  ];

  return (
    <Card className="p-6 mb-6">
      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Progresso do Diagnóstico</h3>
          <Badge variant="outline">
            {Math.round(totalProgress)}% concluído
          </Badge>
        </div>

        <div className="w-full bg-muted rounded-full h-2 mb-6">
          <motion.div 
            className="h-full bg-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${totalProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Steps */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex flex-col items-center text-center p-3 rounded-lg transition-colors ${
                phase.status === 'completed' 
                  ? 'bg-primary/10 text-primary' 
                  : phase.status === 'current'
                  ? 'bg-orange-500/10 text-orange-500'
                  : 'bg-muted/50 text-muted-foreground'
              }`}
            >
              <div className="mb-2">
                {phase.status === 'completed' ? (
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                ) : phase.status === 'current' ? (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Circle className="w-6 h-6 text-orange-500" />
                  </motion.div>
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <span className="text-xs font-medium">{phase.title}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ProgressTracker;