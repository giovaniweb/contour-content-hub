
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDiagnosticPersistence } from '@/hooks/useDiagnosticPersistence';
import { toast } from 'sonner';
import ReportHeader from '@/components/diagnostic-report/ReportHeader';
import QuickMetrics from '@/components/diagnostic-report/QuickMetrics';
import DiagnosticContentFormatter from '@/components/diagnostic-report/DiagnosticContentFormatter';

const DiagnosticReport: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { savedDiagnostics, currentSession } = useDiagnosticPersistence();

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

        {/* Conteúdo do diagnóstico */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Análise Detalhada</h2>
            {session.isCompleted && (
              <div className="flex items-center gap-2 text-sm text-foreground/60">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Diagnóstico Completo
              </div>
            )}
          </div>

          <DiagnosticContentFormatter 
            content={session.state.generatedDiagnostic || ''} 
          />
        </div>

        {/* Ações recomendadas */}
        {session.isCompleted && (
          <div className="mt-8 p-6 aurora-glass rounded-xl">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              🎯 Próximos Passos Recomendados
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-foreground mb-2">Imediato (Esta Semana)</h4>
                <ul className="text-sm text-foreground/80 space-y-1">
                  <li>• Otimizar perfil nas redes sociais</li>
                  <li>• Criar conteúdo sobre sua especialidade</li>
                  <li>• Definir público-alvo específico</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Médio Prazo (30 dias)</h4>
                <ul className="text-sm text-foreground/80 space-y-1">
                  <li>• Implementar estratégia de conteúdo</li>
                  <li>• Criar landing page otimizada</li>
                  <li>• Desenvolver funil de vendas</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosticReport;
