
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign } from "lucide-react";

interface RevenueProjectionCardProps {
  currentRevenue: string;
  revenueGoal: string;
  clinicType: string;
}

const RevenueProjectionCard: React.FC<RevenueProjectionCardProps> = ({ 
  currentRevenue, 
  revenueGoal, 
  clinicType 
}) => {
  const getCurrentRevenueValue = () => {
    const revenueMap = {
      'ate_15k': 12000,
      '15k_30k': 22500,
      '30k_60k': 45000,
      'acima_60k': 75000
    };
    return revenueMap[currentRevenue as keyof typeof revenueMap] || 15000;
  };

  const getProjectedRevenue = () => {
    const current = getCurrentRevenueValue();
    const goalMultipliers = {
      'dobrar': 2,
      'crescer_50': 1.5,
      'crescer_30': 1.3,
      'manter': 1.1
    };
    
    const multiplier = goalMultipliers[revenueGoal as keyof typeof goalMultipliers] || 1.5;
    return Math.round(current * multiplier);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const currentValue = getCurrentRevenueValue();
  const projectedValue = getProjectedRevenue();
  const growthPercentage = Math.round(((projectedValue - currentValue) / currentValue) * 100);

  return (
    <Card className="aurora-glass border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg text-foreground">
          <TrendingUp className="h-5 w-5 text-green-400" />
          💰 Projeção de Crescimento
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground/70">Faturamento Atual:</span>
          <span className="text-lg font-semibold text-foreground">
            {formatCurrency(currentValue)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground/70">Projeção com o Plano:</span>
          <span className="text-xl font-bold text-green-400">
            {formatCurrency(projectedValue)}
          </span>
        </div>
        
        <div className="pt-3 border-t border-green-500/20">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-400" />
            <span className="text-sm text-green-400 font-medium">
              Crescimento potencial: +{growthPercentage}%
            </span>
          </div>
          <p className="text-xs text-foreground/60 mt-1">
            *Baseado na implementação completa das estratégias sugeridas
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueProjectionCard;
