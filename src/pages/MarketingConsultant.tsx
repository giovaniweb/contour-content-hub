
import React from 'react';
import { BrainCircuit, History, Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import AkinatorMarketingConsultant from "@/components/akinator-marketing-consultant/AkinatorMarketingConsultant";

const MarketingConsultant: React.FC = () => {
  const { toast } = useToast();
  const { profile } = useUserProfile();

  const handleViewHistory = () => {
    toast({
      title: "📊 Abrindo histórico de relatórios...",
      description: "Carregando seus diagnósticos anteriores!"
    });
    window.open('/reports', '_blank');
  };

  const getClinicTypeLabel = () => {
    if (!profile?.clinic_type) return 'Não definido';
    return profile.clinic_type === 'clinica_medica' ? 'Clínica Médica' : 'Clínica Estética';
  };

  const getAccessDescription = () => {
    if (!profile?.clinic_type) return 'Defina seu tipo de clínica para personalizar as sugestões';
    return profile.clinic_type === 'clinica_medica' 
      ? 'Acesso completo a equipamentos médicos e estéticos'
      : 'Acesso a equipamentos estéticos (não-médicos)';
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Consultor Fluida</h1>
            <p className="text-muted-foreground">
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
          
          <Button 
            onClick={handleViewHistory}
            variant="outline"
            className="flex items-center gap-2"
          >
            <History className="h-4 w-4" />
            Histórico de Relatórios
          </Button>
        </div>
      </div>

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
