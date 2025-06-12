import React, { useEffect } from 'react';
import { toast } from "sonner";
import { useDiagnosticPersistence, DiagnosticSession } from '@/hooks/useDiagnosticPersistence';
import { useNavigate } from 'react-router-dom';
import DiagnosticHistoryHeader from './DiagnosticHistory/DiagnosticHistoryHeader';
import CurrentSessionCard from './DiagnosticHistory/CurrentSessionCard';
import SavedDiagnosticsSection from './DiagnosticHistory/SavedDiagnosticsSection';
import EmptyState from './DiagnosticHistory/EmptyState';
import { formatDate, generateDownloadContent } from './DiagnosticHistory/utils';
import { debugDiagnosticPersistence } from '@/hooks/useDiagnosticPersistence/debugUtils';

const DiagnosticHistory: React.FC = () => {
  const navigate = useNavigate();
  const {
    savedDiagnostics,
    currentSession,
    deleteDiagnostic,
    loadDiagnostic,
    clearAllData,
    loadSavedDiagnostics
  } = useDiagnosticPersistence();

  // Forçar recarregamento de dados ao montar o componente
  useEffect(() => {
    console.log('🏥 DiagnosticHistory montado - forçando debug e reload');
    debugDiagnosticPersistence();
    
    // Forçar recarregamento dos diagnósticos salvos
    const forceReload = async () => {
      try {
        await loadSavedDiagnostics();
        console.log('🔄 Dados recarregados na página de histórico');
      } catch (error) {
        console.error('❌ Erro ao recarregar dados:', error);
      }
    };
    
    forceReload();
  }, [loadSavedDiagnostics]);

  const handleLoadDiagnostic = async (session: DiagnosticSession) => {
    const loaded = await loadDiagnostic(session.id);
    if (loaded) {
      navigate('/marketing-consultant');
      toast.success("📂 Diagnóstico carregado!", {
        description: `Diagnóstico de ${new Date(session.timestamp).toLocaleDateString('pt-BR')}`
      });
    }
  };

  const handleDeleteDiagnostic = (session: DiagnosticSession) => {
    // Verificar se é dados pagos antes de permitir deletar
    if (session.isPaidData || session.isCompleted) {
      toast.error("🛡️ Dados Protegidos", {
        description: "Este diagnóstico completo não pode ser deletado por segurança."
      });
      return;
    }

    if (confirm('Tem certeza que deseja deletar este diagnóstico?')) {
      deleteDiagnostic(session.id);
      toast.success("🗑️ Diagnóstico removido", {
        description: "Diagnóstico deletado com sucesso"
      });
    }
  };

  const handleDownloadDiagnostic = (session: DiagnosticSession) => {
    try {
      const content = generateDownloadContent(session);
      const blob = new Blob([content], {
        type: 'text/plain;charset=utf-8'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `diagnostico-fluida-${new Date(session.timestamp).toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("📄 Download iniciado!", {
        description: "Relatório salvo em arquivo de texto"
      });
    } catch (error) {
      console.error('Erro no download:', error);
      toast.error("❌ Erro no download");
    }
  };

  const handleClearAllData = async () => {
    // Contar rascunhos (diagnósticos incompletos)
    const drafts = savedDiagnostics.filter(d => !d.isPaidData && !d.isCompleted);
    const paidDiagnostics = savedDiagnostics.filter(d => d.isPaidData || d.isCompleted);
    
    if (drafts.length === 0) {
      toast.info("📝 Nenhum rascunho encontrado", {
        description: "Todos os seus diagnósticos são dados completos protegidos."
      });
      return;
    }

    const message = `Tem certeza que deseja apagar ${drafts.length} rascunho${drafts.length > 1 ? 's' : ''}? ${paidDiagnostics.length > 0 ? `${paidDiagnostics.length} diagnóstico${paidDiagnostics.length > 1 ? 's' : ''} completo${paidDiagnostics.length > 1 ? 's' : ''} será${paidDiagnostics.length > 1 ? 'ão' : ''} preservado${paidDiagnostics.length > 1 ? 's' : ''}.` : ''}`;

    if (confirm(message)) {
      const success = await clearAllData();
      
      if (success) {
        toast.success(`🗑️ ${drafts.length} rascunho${drafts.length > 1 ? 's' : ''} removido${drafts.length > 1 ? 's' : ''}`, {
          description: paidDiagnostics.length > 0 
            ? `${paidDiagnostics.length} diagnóstico${paidDiagnostics.length > 1 ? 's' : ''} completo${paidDiagnostics.length > 1 ? 's' : ''} preservado${paidDiagnostics.length > 1 ? 's' : ''} com segurança`
            : "Limpeza concluída com sucesso"
        });
      } else {
        toast.error("❌ Erro ao limpar rascunhos", {
          description: "Tente novamente em alguns instantes"
        });
      }
    }
  };

  // Debug: Log estado atual
  console.log('🏥 DiagnosticHistory render:', {
    savedDiagnostics: savedDiagnostics.length,
    currentSession: !!currentSession,
    currentSessionId: currentSession?.id
  });

  return (
    <div className="container mx-auto py-6 space-y-8">
      <DiagnosticHistoryHeader />

      <div className="space-y-6">
        {/* Sessão atual */}
        {currentSession && (
          <CurrentSessionCard
            currentSession={currentSession}
            onLoadDiagnostic={handleLoadDiagnostic}
            onDownloadDiagnostic={handleDownloadDiagnostic}
            formatDate={formatDate}
          />
        )}

        {/* Histórico de diagnósticos salvos */}
        {savedDiagnostics.length > 0 && (
          <SavedDiagnosticsSection
            savedDiagnostics={savedDiagnostics}
            currentSession={currentSession}
            onLoadDiagnostic={handleLoadDiagnostic}
            onDownloadDiagnostic={handleDownloadDiagnostic}
            onDeleteDiagnostic={handleDeleteDiagnostic}
            onClearAllData={handleClearAllData}
            formatDate={formatDate}
          />
        )}

        {/* Estado vazio */}
        {!currentSession && savedDiagnostics.length === 0 && <EmptyState />}
      </div>
    </div>
  );
};

export default DiagnosticHistory;
