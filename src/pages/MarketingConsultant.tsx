
import React, { useState } from 'react';
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BrainCircuit, MessageSquare, TrendingUp, Calendar, ArrowRight, Check, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MarketingConsultantChat from "@/components/marketing-consultant/MarketingConsultantChat";
import DiagnosticForm from "@/components/marketing-consultant/DiagnosticForm";
import ProfitCalculator from "@/components/marketing-consultant/ProfitCalculator";
import GrowthStrategy from "@/components/marketing-consultant/GrowthStrategy";
import ImplementationPlan from "@/components/marketing-consultant/ImplementationPlan";

const MarketingConsultant: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'chat' | 'diagnostic' | 'profit' | 'strategy' | 'implementation'>('chat');
  const [diagnosticData, setDiagnosticData] = useState<any>(null);
  const [profitAnalysis, setProfitAnalysis] = useState<any>(null);
  const [strategy, setStrategy] = useState<any>(null);
  const { toast } = useToast();
  
  const handleDiagnosticComplete = (data: any) => {
    setDiagnosticData(data);
    calculateProfit(data);
    setCurrentStep('profit');
  };

  const calculateProfit = (data: any) => {
    // Simulate profit calculation
    // In a real scenario, this would use more complex logic
    const currentRevenue = data.currentRevenue || 0;
    const potentialRevenue = currentRevenue * 1.5; // 50% increase as projection
    
    setProfitAnalysis({
      currentRevenue,
      potentialRevenue,
      currentProfit: currentRevenue * 0.3, // Assuming 30% profit margin
      potentialProfit: potentialRevenue * 0.35, // Slightly improved margin with better strategy
      growthRate: 50,
      timeframe: '3 meses',
    });
  };

  const handleStrategyCreation = (data: any) => {
    setStrategy(data);
    setCurrentStep('implementation');
  };

  const startConsultation = () => {
    setCurrentStep('diagnostic');
    toast({
      title: "Consultor de marketing iniciado",
      description: "Vamos começar seu diagnóstico personalizado.",
    });
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'chat':
        return <MarketingConsultantChat onStartConsultation={startConsultation} />;
      case 'diagnostic':
        return <DiagnosticForm onComplete={handleDiagnosticComplete} />;
      case 'profit':
        return (
          <ProfitCalculator 
            data={profitAnalysis} 
            onContinue={() => setCurrentStep('strategy')} 
          />
        );
      case 'strategy':
        return (
          <GrowthStrategy
            diagnosticData={diagnosticData}
            profitData={profitAnalysis}
            onComplete={handleStrategyCreation}
          />
        );
      case 'implementation':
        return (
          <ImplementationPlan
            strategy={strategy}
            diagnosticData={diagnosticData}
            onReset={() => {
              setCurrentStep('chat');
              setDiagnosticData(null);
              setProfitAnalysis(null);
              setStrategy(null);
            }}
          />
        );
    }
  };

  return (
    <Layout title="Consultor de Marketing">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Consultor de Marketing Inteligente</h1>
              <p className="text-muted-foreground">
                Seu assistente estratégico para crescer sua clínica de estética
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Etapas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                <div className={`rounded-full p-1.5 ${currentStep === 'chat' || currentStep === 'diagnostic' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Diagnóstico</p>
                  <p className="text-xs text-muted-foreground">Avaliação inicial</p>
                </div>
                {(currentStep === 'profit' || currentStep === 'strategy' || currentStep === 'implementation') && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
              </div>
              
              <div className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                <div className={`rounded-full p-1.5 ${currentStep === 'profit' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Simulação de Lucro</p>
                  <p className="text-xs text-muted-foreground">Potencial de crescimento</p>
                </div>
                {(currentStep === 'strategy' || currentStep === 'implementation') && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
              </div>
              
              <div className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                <div className={`rounded-full p-1.5 ${currentStep === 'strategy' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Estratégia</p>
                  <p className="text-xs text-muted-foreground">Plano personalizado</p>
                </div>
                {currentStep === 'implementation' && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
              </div>
              
              <div className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                <div className={`rounded-full p-1.5 ${currentStep === 'implementation' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Implementação</p>
                  <p className="text-xs text-muted-foreground">Ações práticas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="lg:col-span-3">
            {renderCurrentStep()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MarketingConsultant;
