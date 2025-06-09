
import React from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  History, 
  Clock, 
  Trash2, 
  Eye, 
  Download,
  AlertCircle,
  Calendar,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { useDiagnosticPersistence, DiagnosticSession } from '@/hooks/useDiagnosticPersistence';

interface DiagnosticHistoryModalProps {
  onLoadDiagnostic?: (session: DiagnosticSession) => void;
}

const DiagnosticHistoryModal: React.FC<DiagnosticHistoryModalProps> = ({ 
  onLoadDiagnostic 
}) => {
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
      onLoadDiagnostic?.(loaded);
      toast.success("📂 Diagnóstico carregado!", {
        description: `Diagnóstico de ${new Date(session.timestamp).toLocaleDateString('pt-BR')}`
      });
    }
  };

  const handleDeleteDiagnostic = (id: string) => {
    deleteDiagnostic(id);
    toast.success("🗑️ Diagnóstico removido", {
      description: "Diagnóstico deletado com sucesso"
    });
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
${Object.entries(session.state)
  .filter(([key, value]) => value && key !== 'generatedDiagnostic')
  .map(([key, value]) => `${key}: ${value}`)
  .join('\n')}

${session.state.generatedDiagnostic ? `

DIAGNÓSTICO IA
--------------
${session.state.generatedDiagnostic}
` : ''}

---
Relatório gerado pelo Consultor Fluida
      `;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
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

  const handleClearAllData = () => {
    if (confirm('Tem certeza que deseja apagar todos os diagnósticos salvos? Esta ação não pode ser desfeita.')) {
      clearAllData();
      toast.success("🗑️ Todos os dados foram removidos", {
        description: "Histórico completamente limpo"
      });
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Histórico de Diagnósticos
          {savedDiagnostics.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {savedDiagnostics.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <History className="h-5 w-5" />
            Histórico de Diagnósticos
          </DialogTitle>
        </DialogHeader>

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
                      <Button
                        onClick={() => handleLoadDiagnostic(currentSession)}
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        Ver Relatório
                      </Button>
                    )}
                    
                    <Button
                      onClick={() => handleDownloadDiagnostic(currentSession)}
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                    >
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
                
                <Button
                  onClick={handleClearAllData}
                  size="sm"
                  variant="destructive"
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Limpar Tudo
                </Button>
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
                          <Button
                            onClick={() => handleLoadDiagnostic(session)}
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            {session.isCompleted ? 'Ver Relatório' : 'Continuar'}
                          </Button>
                          
                          <Button
                            onClick={() => handleDownloadDiagnostic(session)}
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Download className="h-3 w-3" />
                            Download
                          </Button>
                          
                          <Button
                            onClick={() => handleDeleteDiagnostic(session.id)}
                            size="sm"
                            variant="destructive"
                            className="flex items-center gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            Deletar
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
      </DialogContent>
    </Dialog>
  );
};

export default DiagnosticHistoryModal;
