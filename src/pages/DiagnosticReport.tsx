
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
  const { savedDiagnostics, currentSession, findSessionById } = useDiagnosticPersistence();
  const [activeTab, setActiveTab] = useState('diagnostic');

  console.log('🏥 DiagnosticReport - Parâmetros:', { sessionId });
  console.log('🏥 DiagnosticReport - Estado:', { 
    savedDiagnosticsCount: savedDiagnostics.length,
    currentSessionId: currentSession?.id,
    searchingForId: sessionId
  });

  // Buscar a sessão pelo ID com múltiplas estratégias
  let session = null;
  
  if (sessionId) {
    // Usar a nova função de busca melhorada
    session = findSessionById(sessionId);
    
    // Se ainda não encontrou, tentar busca por padrões similares
    if (!session) {
      console.log('🔍 Tentando busca por padrões similares...');
      
      // Buscar por ID que contenha parte do sessionId
      const similarSession = savedDiagnostics.find(s => 
        s.id.includes(sessionId) || sessionId.includes(s.id)
      );
      
      if (similarSession) {
        console.log('✅ Sessão encontrada por similaridade:', similarSession.id);
        session = similarSession;
      }
    }
  }

  console.log('🏥 DiagnosticReport - Sessão encontrada:', !!session);

  if (!session) {
    console.log('❌ DiagnosticReport - Sessão não encontrada');
    console.log('📊 Diagnósticos disponíveis:', savedDiagnostics.map(d => ({ id: d.id, timestamp: d.timestamp })));
    
    return (
      <div className="min-h-screen bg-aurora-background">
        <div className="container mx-auto py-6">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-foreground">Relatório não encontrado</h1>
            <p className="text-foreground/60">
              O relatório solicitado (ID: {sessionId}) não foi encontrado.
            </p>
            <div className="text-sm text-foreground/40">
              <p>Diagnósticos disponíveis: {savedDiagnostics.length}</p>
              <p>Sessão atual: {currentSession ? 'Existe' : 'Não existe'}</p>
            </div>
            <button 
              onClick={() => navigate('/diagnostic-history')}
              className="px-4 py-2 bg-aurora-electric-purple text-white rounded hover:bg-aurora-electric-purple/80"
            >
              Voltar ao Histórico
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate('/diagnostic-history');
  };

  console.log('✅ DiagnosticReport - Renderizando relatório para sessão:', session.id);

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
