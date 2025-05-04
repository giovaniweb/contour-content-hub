
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

interface ProfitCalculatorProps {
  data: {
    currentRevenue: number;
    potentialRevenue: number;
    currentProfit: number;
    potentialProfit: number;
    growthRate: number;
    timeframe: string;
  };
  onContinue: () => void;
}

const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({ data, onContinue }) => {
  if (!data) return null;
  
  const { currentRevenue, potentialRevenue, currentProfit, potentialProfit, growthRate, timeframe } = data;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  const barData = [
    {
      name: 'Atual',
      Faturamento: currentRevenue,
      Lucro: currentProfit,
    },
    {
      name: 'Potencial',
      Faturamento: potentialRevenue,
      Lucro: potentialProfit,
    },
  ];
  
  // Generate projection data for 6 months
  const projectionData = Array.from({ length: 7 }, (_, i) => {
    const month = i;
    const projectedRevenue = currentRevenue + ((potentialRevenue - currentRevenue) / 6) * month;
    const projectedProfit = currentProfit + ((potentialProfit - currentProfit) / 6) * month;
    
    return {
      month: i === 0 ? 'Hoje' : `Mês ${i}`,
      Faturamento: Math.round(projectedRevenue),
      Lucro: Math.round(projectedProfit),
    };
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Simulação de Lucro Potencial</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Análise de Potencial</h3>
          <p className="text-muted-foreground mb-4">
            Com base nos dados informados, analisamos o potencial de crescimento da sua clínica com uma estratégia otimizada de marketing.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Faturamento atual</p>
              <p className="text-xl font-bold">{formatCurrency(currentRevenue)}</p>
              <p className="text-sm text-muted-foreground mt-4">Lucro atual estimado</p>
              <p className="text-xl font-bold">{formatCurrency(currentProfit)}</p>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <p className="text-sm text-primary">Faturamento potencial</p>
              <p className="text-xl font-bold">{formatCurrency(potentialRevenue)}</p>
              <p className="text-sm text-primary mt-4">Lucro potencial estimado</p>
              <p className="text-xl font-bold">{formatCurrency(potentialProfit)}</p>
              <div className="mt-2 bg-primary/20 px-2 py-1 rounded-full inline-flex items-center text-xs text-primary">
                <span>+{growthRate}% em {timeframe}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-64">
          <h3 className="text-lg font-medium mb-2">Comparativo Atual vs. Potencial</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `R$ ${value/1000}k`} />
              <Tooltip 
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(value) => `Cenário: ${value}`}
              />
              <Legend />
              <Bar dataKey="Faturamento" fill="#4f46e5" />
              <Bar dataKey="Lucro" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="h-64">
          <h3 className="text-lg font-medium mb-2">Projeção em 6 meses</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `R$ ${value/1000}k`} />
              <Tooltip 
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(value) => `${value}`}
              />
              <Legend />
              <Line type="monotone" dataKey="Faturamento" stroke="#4f46e5" strokeWidth={2} />
              <Line type="monotone" dataKey="Lucro" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="p-4 border rounded-lg bg-amber-50">
          <h3 className="font-medium mb-1 text-amber-800">Análise</h3>
          <p className="text-amber-700">
            Com uma estratégia bem implementada, sua clínica pode alcançar um crescimento significativo.
            Vamos criar um plano detalhado para atingir estes resultados em até {timeframe}.
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="justify-end">
        <Button onClick={onContinue}>
          Criar Estratégia de Crescimento
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfitCalculator;
