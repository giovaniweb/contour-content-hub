
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Zap, Calendar, Lightbulb } from "lucide-react";
import { DiagnosticSession } from '@/hooks/useDiagnosticPersistence';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ActionsSection } from './actions-tab/ActionsSection';
import { ImplementationTips } from './actions-tab/ImplementationTips';
import { GrowthStrategyAccordion } from './actions-tab/GrowthStrategyAccordion';
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
      <Accordion type="multiple" defaultValue={["immediate"]} className="space-y-4">
        {/* Ações Imediatas */}
        <AccordionItem value="immediate" className="aurora-card border-aurora-electric-purple/30 rounded-lg">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-aurora-electric-purple" />
              <span className="text-lg font-semibold">Ações Imediatas (Esta Semana)</span>
              <Badge variant="outline" className="border-red-500/30 text-red-400">
                Urgente
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-4">
              {immediateActions.map((action, index) => (
                <div key={index} className="aurora-glass border-white/10 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-foreground">{action.title}</h4>
                        <Badge variant="outline" className={getPriorityColor(action.priority)}>
                          {action.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground/70 mb-3">{action.description}</p>
                      <div className="flex items-center gap-4 text-xs text-foreground/60">
                        <span>⏱️ {action.time}</span>
                        <Badge variant="secondary" className="text-xs">
                          {action.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Ações de Médio Prazo */}
        <AccordionItem value="medium" className="aurora-card border-aurora-sage/30 rounded-lg">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-aurora-sage" />
              <span className="text-lg font-semibold">Médio Prazo (30 dias)</span>
              <Badge variant="outline" className="border-aurora-sage/30 text-aurora-sage">
                Planejamento
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-4">
              {mediumTermActions.map((action, index) => (
                <div key={index} className="aurora-glass border-white/10 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-foreground">{action.title}</h4>
                        <Badge variant="outline" className={getPriorityColor(action.priority)}>
                          {action.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground/70 mb-3">{action.description}</p>
                      <div className="flex items-center gap-4 text-xs text-foreground/60">
                        <span>⏱️ {action.time}</span>
                        <Badge variant="secondary" className="text-xs">
                          {action.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Estratégia de Crescimento */}
        <AccordionItem value="growth" className="aurora-card border-aurora-lavender/30 rounded-lg">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <Lightbulb className="h-5 w-5 text-aurora-lavender" />
              <span className="text-lg font-semibold">Estratégia de Crescimento - {getMainSpecialty()}</span>
              <Badge variant="outline" className="border-aurora-lavender/30 text-aurora-lavender">
                4 Semanas
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <GrowthStrategyAccordion session={session} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Dicas de Implementação */}
      <ImplementationTips />
    </div>
  );
};

export default ActionsTab;
