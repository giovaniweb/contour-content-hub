import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, Clock, Trash2, Eye, Download, AlertCircle, Calendar, FileText, ArrowLeft, Shield } from "lucide-react";
import { toast } from "sonner";
import { useDiagnosticPersistence, DiagnosticSession } from '@/hooks/useDiagnosticPersistence';
import { useNavigate } from 'react-router-dom';

const DiagnosticHistory: React.FC = () => {
  const navigate = useNavigate();
  const {
    savedDiagnostics,
    currentSession,
    deleteDiagnostic,
    loadDiagnostic,
    clearAllData
  } = useDiagnosticPersistence();

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
      const content = `
RELATÓRIO DE DIAGNÓSTICO - CONSULTOR FLUIDA
============================================

Data: ${new Date(session.timestamp).toLocaleString('pt-BR')}
Tipo: ${session.clinicTypeLabel}
Especialidade: ${session.specialty}

RESPOSTAS COLETADAS
-------------------
${Object.entries(session.state).filter(([key, value]) => value && key !== 'generatedDiagnostic').map(([key, value]) => `${key}: ${value}`).join('\n')}

${session.state.generatedDiagnostic ? `

DIAGNÓSTICO IA
--------------
${session.state.generatedDiagnostic}
` : ''}

---
Relatório gerado pelo Consultor Fluida
      `;
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

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" onClick={() => navigate('/marketing-consultant')} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div className="flex items-center gap-3">
          <History className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-slate-50">Histórico de Diagnósticos</h1>
        </div>
      </div>

      <div className="space-y-6">
        {/* Sessão atual */}
        {currentSession && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-400" />
              Sessão Atual
            </h3>
            
            <Card className="aurora-card border-blue-500/30">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      {currentSession.clinicTypeLabel}
                      <Badge variant={currentSession.isCompleted ? "default" : "secondary"}>
                        {currentSession.isCompleted ? "Completo" : "Em progresso"}
                      </Badge>
                      {(currentSession.isPaidData || currentSession.isCompleted) && (
                        <Badge variant="outline" className="border-green-500/30 text-green-400">
                          <Shield className="h-3 w-3 mr-1" />
                          Protegido
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-white/70 mt-1">
                      {currentSession.specialty}
                    </p>
                  </div>
                  <div className="text-right text-sm text-white/60">
                    {formatDate(currentSession.timestamp).date}
                    <br />
                    {formatDate(currentSession.timestamp).time}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  {currentSession.isCompleted && (
                    <Button onClick={() => handleLoadDiagnostic(currentSession)} size="sm" className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      Ver Relatório
                    </Button>
                  )}
                  
                  <Button onClick={() => handleDownloadDiagnostic(currentSession)} size="sm" variant="outline" className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Histórico de diagnósticos salvos */}
        {savedDiagnostics.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-400" />
                Diagnósticos Salvos ({savedDiagnostics.length})
              </h3>
              
              {savedDiagnostics.some(d => !d.isPaidData && !d.isCompleted) && (
                <Button onClick={handleClearAllData} size="sm" variant="destructive" className="flex items-center gap-1">
                  <Trash2 className="h-3 w-3" />
                  Limpar Rascunhos
                </Button>
              )}
            </div>

            <div className="grid gap-4">
              {savedDiagnostics.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="aurora-card hover:border-aurora-electric-purple/40 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white flex items-center gap-2">
                            {session.clinicTypeLabel}
                            <Badge variant={session.isCompleted ? "default" : "secondary"}>
                              {session.isCompleted ? "Completo" : "Incompleto"}
                            </Badge>
                            {session.id === currentSession?.id && (
                              <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                                Atual
                              </Badge>
                            )}
                            {(session.isPaidData || session.isCompleted) && (
                              <Badge variant="outline" className="border-green-500/30 text-green-400">
                                <Shield className="h-3 w-3 mr-1" />
                                Protegido
                              </Badge>
                            )}
                          </CardTitle>
                          <p className="text-sm text-white/70 mt-1">
                            {session.specialty}
                          </p>
                        </div>
                        <div className="text-right text-sm text-white/60">
                          {formatDate(session.timestamp).date}
                          <br />
                          {formatDate(session.timestamp).time}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex gap-2">
                        <Button onClick={() => handleLoadDiagnostic(session)} size="sm" className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {session.isCompleted ? 'Ver Relatório' : 'Continuar'}
                        </Button>
                        
                        <Button onClick={() => handleDownloadDiagnostic(session)} size="sm" variant="outline" className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                        
                        <Button 
                          onClick={() => handleDeleteDiagnostic(session)} 
                          size="sm" 
                          variant={session.isPaidData || session.isCompleted ? "outline" : "destructive"}
                          disabled={session.isPaidData || session.isCompleted}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          {session.isPaidData || session.isCompleted ? 'Protegido' : 'Deletar'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Estado vazio */}
        {!currentSession && savedDiagnostics.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Nenhum diagnóstico encontrado
            </h3>
            <p className="text-white/70">
              Inicie um novo diagnóstico para começar a usar o Consultor Fluida
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosticHistory;
