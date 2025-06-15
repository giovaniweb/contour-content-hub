import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, Download, Shield, AlertTriangle, Eraser } from "lucide-react";
import { DiagnosticSession } from '@/hooks/useDiagnosticPersistence';
import ReportViewButton from '@/components/ui/ReportViewButton';
import ReportPdfButton from '@/components/ui/ReportPdfButton';
import GenerateAuroraPdfButton from "@/components/ui/GenerateAuroraPdfButton";

interface SavedDiagnosticsSectionProps {
  savedDiagnostics: DiagnosticSession[];
  currentSession: DiagnosticSession | null;
  onLoadDiagnostic: (session: DiagnosticSession) => void;
  onDownloadDiagnostic: (session: DiagnosticSession) => void;
  onDeleteDiagnostic: (session: DiagnosticSession) => void;
  onForceDeleteDiagnostic?: (session: DiagnosticSession) => void;
  onClearAllData: () => void;
  onClearLegacyData?: () => void;
  formatDate: (timestamp: string) => { date: string; time: string };
}

const SavedDiagnosticsSection: React.FC<SavedDiagnosticsSectionProps> = ({
  savedDiagnostics,
  currentSession,
  onLoadDiagnostic,
  onDownloadDiagnostic,
  onDeleteDiagnostic,
  onForceDeleteDiagnostic,
  onClearAllData,
  onClearLegacyData,
  formatDate
}) => {
  const navigate = useNavigate();

  const handleViewReport = (session: DiagnosticSession) => {
    navigate(`/diagnostic-report/${session.id}`);
  };

  // Separar diagnósticos por tipo
  const completedDiagnostics = savedDiagnostics.filter(d => d.isPaidData || d.isCompleted);
  const draftDiagnostics = savedDiagnostics.filter(d => !d.isPaidData && !d.isCompleted);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-green-400" />
          Diagnósticos Salvos ({savedDiagnostics.length})
        </h3>
        
        <div className="flex gap-2">
          {draftDiagnostics.length > 0 && (
            <Button onClick={onClearAllData} size="sm" variant="destructive" className="flex items-center gap-1">
              <Trash2 className="h-3 w-3" />
              Limpar Rascunhos
            </Button>
          )}
          
          {onClearLegacyData && (
            <Button onClick={onClearLegacyData} size="sm" variant="outline" className="flex items-center gap-1 bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20">
              <Eraser className="h-3 w-3" />
              Limpar Dados Legados
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {savedDiagnostics.map((session, index) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="aurora-glass border-aurora-electric-purple/30 hover:border-aurora-electric-purple/40 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      {session.clinicTypeLabel}
                      <Badge variant={session.isCompleted ? "default" : "secondary"} className={session.isCompleted ? "bg-aurora-gradient-primary text-white" : "bg-gray-500/20 text-white"}>
                        {session.isCompleted ? "Completo" : "Incompleto"}
                      </Badge>
                      {session.id === currentSession?.id && (
                        <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10">
                          Atual
                        </Badge>
                      )}
                      {(session.isPaidData || session.isCompleted) && (
                        <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10">
                          <Shield className="h-3 w-3 mr-1" />
                          Protegido
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-white/80 mt-1">
                      {session.specialty}
                    </p>
                  </div>
                  <div className="text-right text-sm text-white/70">
                    {formatDate(session.timestamp).date}
                    <br />
                    {formatDate(session.timestamp).time}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2 flex-wrap">
                  <ReportViewButton
                    session={session}
                    onClick={() => handleViewReport(session)}
                  />

                  <ReportPdfButton
                    pdfUrl={
                      typeof session.state.generatedDiagnostic === "string" &&
                      session.state.generatedDiagnostic.startsWith("http")
                        ? session.state.generatedDiagnostic
                        : undefined
                    }
                    diagnosticTitle={session.clinicTypeLabel}
                  />

                  {/* NOVO: botão exportar PDF Aurora */}
                  {(typeof session.state.generatedDiagnostic === "string" && session.state.generatedDiagnostic.length > 0) && (
                    <GenerateAuroraPdfButton
                      sessionId={session.id}
                      diagnosticText={session.state.generatedDiagnostic}
                      title={session.clinicTypeLabel || "Relatório Fluida"}
                      type="marketingDiagnostic"
                    />
                  )}

                  <Button onClick={() => onDownloadDiagnostic(session)} size="sm" variant="outline" className="flex items-center gap-1 bg-aurora-glass border-aurora-electric-purple/30 text-white hover:bg-aurora-electric-purple/20">
                    <Download className="h-3 w-3" />
                    Download
                  </Button>
                  
                  {/* Botão de deletar normal (apenas para rascunhos) */}
                  {!session.isPaidData && !session.isCompleted && (
                    <Button 
                      onClick={() => onDeleteDiagnostic(session)} 
                      size="sm" 
                      variant="destructive"
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      Deletar
                    </Button>
                  )}
                  
                  {/* Botão de forçar exclusão (para dados completos) */}
                  {(session.isPaidData || session.isCompleted) && onForceDeleteDiagnostic && (
                    <Button 
                      onClick={() => onForceDeleteDiagnostic(session)} 
                      size="sm" 
                      variant="outline"
                      className="flex items-center gap-1 border-orange-500/30 text-orange-400 hover:bg-orange-500/20"
                    >
                      <AlertTriangle className="h-3 w-3" />
                      Forçar Exclusão
                    </Button>
                  )}
                  
                  {/* Indicador se dados estão protegidos mas sem opção de forçar exclusão */}
                  {(session.isPaidData || session.isCompleted) && !onForceDeleteDiagnostic && (
                    <Button 
                      disabled
                      size="sm" 
                      variant="outline"
                      className="flex items-center gap-1 opacity-50"
                    >
                      <Shield className="h-3 w-3" />
                      Protegido
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SavedDiagnosticsSection;
