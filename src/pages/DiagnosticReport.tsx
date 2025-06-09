
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDiagnosticPersistence } from '@/hooks/useDiagnosticPersistence';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportHeader from '@/components/diagnostic-report/ReportHeader';
import QuickMetrics from '@/components/diagnostic-report/QuickMetrics';
import DiagnosticTab from '@/components/diagnostic-report/DiagnosticTab';
import ActionsTab from '@/components/diagnostic-report/ActionsTab';
import ContentTab from '@/components/diagnostic-report/ContentTab';
import MetricsTab from '@/components/diagnostic-report/MetricsTab';

const DiagnosticReport: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { savedDiagnostics, currentSession } = useDiagnosticPersistence();
  const [activeTab, setActiveTab] = useState('diagnostic');

  // Encontrar a sessão pelo ID
  const session = savedDiagnostics.find(s => s.id === sessionId) || 
                 (currentSession?.id === sessionId ? currentSession : null);

  if (!session) {
    return (
      <div className="min-h-screen bg-aurora-background">
        <div className="container mx-auto py-6">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-foreground">Relatório não encontrado</h1>
            <p className="text-foreground/60">O relatório solicitado não foi encontrado.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate('/diagnostic-history');
  };

  return (
    <div className="min-h-screen bg-aurora-background">
      <div className="container mx-auto py-6 max-w-6xl">
        {/* Header do relatório */}
        <ReportHeader session={session} onBack={handleBack} />

        {/* Métricas rápidas */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Métricas Principais</h2>
          <QuickMetrics state={session.state} />
        </div>

        {/* Tabs de conteúdo */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 aurora-glass">
            <TabsTrigger value="diagnostic" className="text-sm">
              🎯 Diagnóstico
            </TabsTrigger>
            <TabsTrigger value="actions" className="text-sm">
              ⚡ Ações
            </TabsTrigger>
            <TabsTrigger value="content" className="text-sm">
              📝 Conteúdo
            </TabsTrigger>
            <TabsTrigger value="metrics" className="text-sm">
              📊 Métricas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diagnostic">
            <DiagnosticTab session={session} />
          </TabsContent>

          <TabsContent value="actions">
            <ActionsTab session={session} />
          </TabsContent>

          <TabsContent value="content">
            <ContentTab session={session} />
          </TabsContent>

          <TabsContent value="metrics">
            <MetricsTab session={session} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DiagnosticReport;
