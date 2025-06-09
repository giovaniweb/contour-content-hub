
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Download, Shield } from "lucide-react";
import { DiagnosticSession } from '@/hooks/useDiagnosticPersistence';
import ReportViewButton from '@/components/ui/ReportViewButton';

interface CurrentSessionCardProps {
  currentSession: DiagnosticSession;
  onLoadDiagnostic: (session: DiagnosticSession) => void;
  onDownloadDiagnostic: (session: DiagnosticSession) => void;
  formatDate: (timestamp: string) => { date: string; time: string };
}

const CurrentSessionCard: React.FC<CurrentSessionCardProps> = ({
  currentSession,
  onLoadDiagnostic,
  onDownloadDiagnostic,
  formatDate
}) => {
  const navigate = useNavigate();

  const handleViewReport = () => {
    navigate(`/diagnostic-report/${currentSession.id}`);
  };

  return (
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
            <ReportViewButton
              session={currentSession}
              onClick={handleViewReport}
            />
            
            <Button onClick={() => onDownloadDiagnostic(currentSession)} size="sm" variant="outline" className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrentSessionCard;
