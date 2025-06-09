
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, Download, Shield } from "lucide-react";
import { DiagnosticSession } from '@/hooks/useDiagnosticPersistence';
import ReportViewButton from '@/components/ui/ReportViewButton';
import DiagnosticReportModal from '@/components/ui/DiagnosticReportModal';

interface SavedDiagnosticsSectionProps {
  savedDiagnostics: DiagnosticSession[];
  currentSession: DiagnosticSession | null;
  onLoadDiagnostic: (session: DiagnosticSession) => void;
  onDownloadDiagnostic: (session: DiagnosticSession) => void;
  onDeleteDiagnostic: (session: DiagnosticSession) => void;
  onClearAllData: () => void;
  formatDate: (timestamp: string) => { date: string; time: string };
}

const SavedDiagnosticsSection: React.FC<SavedDiagnosticsSectionProps> = ({
  savedDiagnostics,
  currentSession,
  onLoadDiagnostic,
  onDownloadDiagnostic,
  onDeleteDiagnostic,
  onClearAllData,
  formatDate
}) => {
  const [selectedSession, setSelectedSession] = useState<DiagnosticSession | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewReport = (session: DiagnosticSession) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
  };

  const handleDownloadFromModal = () => {
    if (selectedSession) {
      onDownloadDiagnostic(selectedSession);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-green-400" />
          Diagnósticos Salvos ({savedDiagnostics.length})
        </h3>
        
        {savedDiagnostics.some(d => !d.isPaidData && !d.isCompleted) && (
          <Button onClick={onClearAllData} size="sm" variant="destructive" className="flex items-center gap-1">
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
                  <ReportViewButton
                    session={session}
                    onClick={() => handleViewReport(session)}
                  />
                  
                  <Button onClick={() => onDownloadDiagnostic(session)} size="sm" variant="outline" className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    Download
                  </Button>
                  
                  <Button 
                    onClick={() => onDeleteDiagnostic(session)} 
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

      <DiagnosticReportModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        session={selectedSession}
        onDownload={handleDownloadFromModal}
      />
    </div>
  );
};

export default SavedDiagnosticsSection;
