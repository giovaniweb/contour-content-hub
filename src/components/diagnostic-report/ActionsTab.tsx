
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Zap, Calendar } from "lucide-react";
import { DiagnosticSession } from '@/hooks/useDiagnosticPersistence';
import { ActionsSection } from './actions-tab/ActionsSection';
import { ImplementationTips } from './actions-tab/ImplementationTips';
import { generateImmediateActions, mediumTermActions } from './actions-tab/actionData';
import { getPriorityColor } from './actions-tab/utils';

interface ActionsTabProps {
  session: DiagnosticSession;
}

const ActionsTab: React.FC<ActionsTabProps> = ({ session }) => {
  const getMainSpecialty = () => {
    if (session.state.clinicType === 'clinica_medica') {
      return session.state.medicalSpecialty || 'Medicina';
    }
    return session.state.aestheticFocus || 'Estética';
  };

  const immediateActions = generateImmediateActions(getMainSpecialty());

  return (
    <div className="space-y-6">
      {/* Ações Imediatas */}
      <ActionsSection
        title="Ações Imediatas (Esta Semana)"
        icon={<Zap className="h-5 w-5 text-aurora-electric-purple" />}
        badge={
          <Badge variant="outline" className="border-red-500/30 text-red-400">
            Urgente
          </Badge>
        }
        actions={immediateActions}
        getPriorityColor={getPriorityColor}
        className="border-aurora-electric-purple/30"
      />

      {/* Ações de Médio Prazo */}
      <ActionsSection
        title="Médio Prazo (30 dias)"
        icon={<Calendar className="h-5 w-5 text-aurora-sage" />}
        badge={
          <Badge variant="outline" className="border-aurora-sage/30 text-aurora-sage">
            Planejamento
          </Badge>
        }
        actions={mediumTermActions}
        getPriorityColor={getPriorityColor}
        className="border-aurora-sage/30"
      />

      {/* Dicas de Implementação */}
      <ImplementationTips />
    </div>
  );
};

export default ActionsTab;
