
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
import { toast } from 'sonner';

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

  const handleDownloadPdf = async (session: DiagnosticSession) => {
    try {
      toast.loading("Gerando PDF...", { id: "pdf-download" });
      
      // Chamar a edge function para gerar PDF
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: session.id,
          title: `Relatório ${session.clinicTypeLabel} - ${session.specialty}`,
          htmlString: session.state.generatedDiagnostic || '',
          type: 'diagnostic-report'
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar PDF');
      }

      const data = await response.json();
      
      if (data.success && data.pdfUrl) {
        // Iniciar download do PDF
        const link = document.createElement('a');
        link.href = data.pdfUrl;
        link.download = `diagnostico-${session.clinicTypeLabel.toLowerCase().replace(/\s+/g, '-')}-${new Date(session.timestamp).toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success("PDF baixado com sucesso!", { id: "pdf-download" });
      } else {
        throw new Error(data.error || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error("Erro ao gerar PDF", { 
        description: "Tente novamente em alguns instantes",
        id: "pdf-download" 
      });
    }
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

                  <Button 
                    onClick={() => handleDownloadPdf(session)} 
                    size="sm" 
                    variant="outline" 
                    className="flex items-center gap-1 bg-aurora-glass border-aurora-electric-purple/30 text-white hover:bg-aurora-electric-purple/20"
                  >
                    <Download className="h-3 w-3" />
                    Download PDF
                  </Button>
                  
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
