
import React from 'react';
import { BrainCircuit, History, Shield, AlertCircle, FileText, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useDiagnosticPersistence } from "@/hooks/useDiagnosticPersistence";
import AkinatorMarketingConsultant from "@/components/akinator-marketing-consultant/AkinatorMarketingConsultant";
import DiagnosticHistoryModal from "@/components/akinator-marketing-consultant/DiagnosticHistoryModal";

const MarketingConsultant: React.FC = () => {
  const { toast } = useToast();
  const { profile } = useUserProfile();
  const { 
    currentSession, 
    savedDiagnostics, 
    hasCurrentSession, 
    isSessionCompleted,
    loadDiagnostic 
  } = useDiagnosticPersistence();

  const handleViewHistory = () => {
    toast({
      title: "📊 Abrindo histórico de relatórios...",
      description: "Carregando seus diagnósticos anteriores!"
    });
  };

  const handleContinueLastDiagnostic = () => {
    if (currentSession) {
      // O componente AkinatorMarketingConsultant já vai detectar e carregar automaticamente
      window.location.reload();
    }
  };

  const handleLoadDiagnostic = (session: any) => {
    // Força o reload para garantir que o diagnóstico seja carregado
    window.location.reload();
  };

  const getClinicTypeLabel = () => {
    if (!profile?.clinic_type) return 'Não definido';
    return profile.clinic_type === 'clinica_medica' ? 'Clínica Médica' : 'Clínica Estética';
  };

  const getAccessDescription = () => {
    if (!profile?.clinic_type) return 'Defina seu tipo de clínica para personalizar as sugestões';
    return profile.clinic_type === 'clinica_medica' ? 'Acesso completo a equipamentos médicos e estéticos' : 'Acesso a equipamentos estéticos (não-médicos)';
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Consultor Fluida</h1>
            <p className="text-slate-500">
              Diagnóstico inteligente para sua clínica
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {profile?.clinic_type && (
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
              <Shield className="h-4 w-4 text-primary" />
              <div className="text-sm">
                <div className="font-medium">{getClinicTypeLabel()}</div>
                <div className="text-xs text-muted-foreground">{getAccessDescription()}</div>
              </div>
            </div>
          )}
          
          <DiagnosticHistoryModal onLoadDiagnostic={handleLoadDiagnostic} />
        </div>
      </div>

      {/* Alerta para continuar diagnóstico salvo */}
      {hasCurrentSession() && (
        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {isSessionCompleted() ? 'Diagnóstico Disponível' : 'Diagnóstico em Progresso'}
                </h3>
                <p className="text-white/70 text-sm mb-3">
                  {isSessionCompleted() 
                    ? `Seu último diagnóstico completo está disponível (${formatDate(currentSession!.timestamp)})`
                    : `Continue de onde parou seu diagnóstico (${formatDate(currentSession!.timestamp)})`
                  }
                </p>
                
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                    {currentSession?.clinicTypeLabel}
                  </Badge>
                  <Badge variant="outline" className="border-green-500/30 text-green-400">
                    {currentSession?.specialty}
                  </Badge>
                  <Badge variant={isSessionCompleted() ? "default" : "secondary"}>
                    {isSessionCompleted() ? "Completo" : "Em progresso"}
                  </Badge>
                </div>
              </div>
              
              <Button
                onClick={handleContinueLastDiagnostic}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                {isSessionCompleted() ? 'Ver Relatório' : 'Continuar'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Indicador de histórico */}
      {savedDiagnostics.length > 0 && !hasCurrentSession() && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <History className="h-5 w-5 text-amber-500" />
              <span className="text-amber-600 font-medium">
                Você tem {savedDiagnostics.length} diagnóstico{savedDiagnostics.length > 1 ? 's' : ''} salvo{savedDiagnostics.length > 1 ? 's' : ''}
              </span>
              <Badge variant="outline" className="border-amber-500/30 text-amber-600">
                {savedDiagnostics.length} relatórios
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {!profile?.clinic_type && (
        <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Configure seu perfil</span>
          </div>
          <p className="text-sm text-amber-700 mb-3">
            Para receber sugestões personalizadas de equipamentos, é importante definir se sua clínica é médica ou estética.
          </p>
          <Badge variant="outline" className="text-amber-700 border-amber-300">
            Inicie o diagnóstico para configurar
          </Badge>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <AkinatorMarketingConsultant />
      </div>
    </div>
  );
};

export default MarketingConsultant;
