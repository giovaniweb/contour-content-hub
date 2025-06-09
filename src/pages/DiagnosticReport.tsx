
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDiagnosticPersistence } from '@/hooks/useDiagnosticPersistence';
import MarketingDashboard from '@/components/akinator-marketing-consultant/MarketingDashboard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const DiagnosticReport: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { savedDiagnostics, currentSession } = useDiagnosticPersistence();

  // Encontrar a sessão pelo ID
  const session = savedDiagnostics.find(s => s.id === sessionId) || 
                 (currentSession?.id === sessionId ? currentSession : null);

  if (!session) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Relatório não encontrado</h1>
          <p className="text-foreground/60">O relatório solicitado não foi encontrado.</p>
          <Button onClick={() => navigate('/diagnostic-history')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Histórico
          </Button>
        </div>
      </div>
    );
  }

  const handleRestart = () => {
    toast.info("🔄 Novo diagnóstico", {
      description: "Redirecionando para iniciar novo diagnóstico..."
    });
    navigate('/marketing-consultant');
  };

  const handleStateUpdate = () => {
    // Não fazer nada aqui pois é apenas visualização
  };

  return (
    <div className="min-h-screen bg-aurora-background">
      <div className="container mx-auto py-6">
        {/* Header com botão de voltar */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/diagnostic-history')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Histórico
          </Button>
        </div>

        {/* Dashboard completo */}
        <MarketingDashboard
          state={session.state}
          mentor={{
            name: 'Mentor Fluida',
            speciality: 'Marketing Digital'
          }}
          aiSections={{}}
          onRestart={handleRestart}
          onStateUpdate={handleStateUpdate}
        />
      </div>
    </div>
  );
};

export default DiagnosticReport;
