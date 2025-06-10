
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";
import { DiagnosticSession } from '@/hooks/useDiagnosticPersistence';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GrowthStrategyAccordion } from './actions-tab/GrowthStrategyAccordion';
import { ImplementationTips } from './actions-tab/ImplementationTips';

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

  return (
    <div className="space-y-8">
      {/* Estratégia de Crescimento */}
      <Accordion type="multiple" defaultValue={["growth"]} className="space-y-8">
        <AccordionItem value="growth" className="aurora-glass border-aurora-lavender/30 rounded-lg backdrop-blur-xl bg-gradient-to-br from-aurora-lavender/10 to-aurora-deep-purple/5 hover:shadow-aurora-glow transition-all duration-300">
          <AccordionTrigger className="px-6 py-6 hover:no-underline group">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-aurora-lavender/20 group-hover:bg-aurora-lavender/30 transition-colors aurora-glow-intense">
                <Lightbulb className="h-5 w-5 text-aurora-lavender group-hover:animate-pulse" />
              </div>
              <span className="text-lg font-semibold text-white">Estratégia de Crescimento - {getMainSpecialty()}</span>
              <Badge variant="outline" className="border-aurora-lavender/30 text-aurora-lavender bg-aurora-lavender/10 backdrop-blur-sm animate-aurora-pulse">
                4 Semanas
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-8">
            <div className="pt-2">
              <GrowthStrategyAccordion session={session} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Dicas de Implementação */}
      <div className="aurora-glass border-aurora-deep-purple/30 rounded-lg backdrop-blur-xl bg-gradient-to-br from-aurora-deep-purple/10 to-aurora-electric-purple/5 p-8 hover:shadow-aurora-glow transition-all duration-300 mt-8">
        <ImplementationTips />
      </div>
    </div>
  );
};

export default ActionsTab;
