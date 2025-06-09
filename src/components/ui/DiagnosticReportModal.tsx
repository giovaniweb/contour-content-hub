
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Brain, 
  Download, 
  Share2, 
  Star, 
  Calendar, 
  Clock, 
  Shield,
  Sparkles,
  FileText,
  Target,
  TrendingUp
} from "lucide-react";
import { DiagnosticSession } from '@/hooks/useDiagnosticPersistence';

interface DiagnosticReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: DiagnosticSession | null;
  onDownload?: () => void;
  onShare?: () => void;
}

const DiagnosticReportModal: React.FC<DiagnosticReportModalProps> = ({
  isOpen,
  onClose,
  session,
  onDownload,
  onShare
}) => {
  if (!session) return null;

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const isPaid = session.isPaidData || session.isCompleted;
  const diagnosticContent = session.state.generatedDiagnostic || '';

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  // Simular score baseado no estado do diagnóstico
  const strategicScore = session.isCompleted ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 40) + 30;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 border-none bg-transparent shadow-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Card className="aurora-glass border-aurora-electric-purple/30 h-[90vh] flex flex-col">
                <DialogHeader className="p-6 pb-4 border-b border-white/10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <DialogTitle className="flex items-center gap-3 text-2xl text-foreground mb-2">
                        <Brain className="h-7 w-7 text-aurora-electric-purple" />
                        Diagnóstico Estratégico Completo
                        {isPaid && (
                          <Badge variant="outline" className="border-green-500/30 text-green-400">
                            <Shield className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </DialogTitle>
                      
                      <div className="flex items-center gap-4 text-sm text-foreground/70">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(session.timestamp).date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(session.timestamp).time}
                        </div>
                        <Badge variant={session.isCompleted ? "default" : "secondary"}>
                          {session.isCompleted ? "Completo" : "Em progresso"}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-foreground/60 mb-1">Score Estratégico</div>
                      <div className={`text-2xl font-bold ${getScoreColor(strategicScore)}`}>
                        {strategicScore}/100
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6">
                  {/* Informações do diagnóstico */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <Card className="aurora-card">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-foreground">
                          <Target className="h-5 w-5 text-aurora-sage" />
                          Especialização
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm text-foreground/60">Tipo de Clínica:</span>
                            <p className="font-medium text-foreground">{session.clinicTypeLabel}</p>
                          </div>
                          <div>
                            <span className="text-sm text-foreground/60">Especialidade:</span>
                            <p className="font-medium text-foreground">{session.specialty}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="aurora-card">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-foreground">
                          <TrendingUp className="h-5 w-5 text-aurora-electric-purple" />
                          Análise Estratégica
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-foreground/60">Potencial de Crescimento:</span>
                            <Badge variant="outline" className="border-green-500/30 text-green-400">
                              Alto
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-foreground/60">Status:</span>
                            <Badge variant={session.isCompleted ? "default" : "secondary"}>
                              {session.isCompleted ? "Análise Completa" : "Em Desenvolvimento"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Separator className="my-6 bg-white/10" />

                  {/* Conteúdo do diagnóstico */}
                  {diagnosticContent ? (
                    <Card className="aurora-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-foreground">
                          <Sparkles className="h-5 w-5 text-aurora-lavender" />
                          Análise Detalhada
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-sm max-w-none text-foreground/90 leading-relaxed">
                          {diagnosticContent.split('\n').map((paragraph: string, index: number) => (
                            paragraph.trim() && (
                              <motion.p 
                                key={index} 
                                className="mb-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                {paragraph.replace(/[*#]/g, '')}
                              </motion.p>
                            )
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="aurora-card">
                      <CardContent className="text-center py-8">
                        <FileText className="h-12 w-12 text-foreground/30 mx-auto mb-4" />
                        <p className="text-foreground/60">
                          {session.isCompleted 
                            ? "Diagnóstico em processamento..." 
                            : "Continue respondendo as perguntas para gerar seu diagnóstico completo."
                          }
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Footer com ações */}
                <div className="p-6 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* Implementar favoritos */}}
                        className="flex items-center gap-1"
                      >
                        <Star className="h-4 w-4" />
                        Favoritar
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      {onShare && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onShare}
                          className="flex items-center gap-1"
                        >
                          <Share2 className="h-4 w-4" />
                          Compartilhar
                        </Button>
                      )}
                      
                      {onDownload && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onDownload}
                          className="flex items-center gap-1"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      )}

                      <Button onClick={onClose}>
                        Fechar
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default DiagnosticReportModal;
