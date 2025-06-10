
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Calendar, Lightbulb, Trello, Plus } from "lucide-react";
import { DiagnosticSession } from '@/hooks/useDiagnosticPersistence';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ActionsSection } from './actions-tab/ActionsSection';
import { ImplementationTips } from './actions-tab/ImplementationTips';
import { GrowthStrategyAccordion } from './actions-tab/GrowthStrategyAccordion';
import { generateImmediateActions, mediumTermActions } from './actions-tab/actionData';
import { getPriorityColor } from './actions-tab/utils';
import { useDiagnosticToPlanner } from '@/hooks/useDiagnosticToPlanner';

interface ActionsTabProps {
  session: DiagnosticSession;
}

const ActionsTab: React.FC<ActionsTabProps> = ({ session }) => {
  const { addActionToPlanner, addMultipleActionsToPlanner, isAdding } = useDiagnosticToPlanner(session);
  
  const getMainSpecialty = () => {
    if (session.state.clinicType === 'clinica_medica') {
      return session.state.medicalSpecialty || 'Medicina';
    }
    return session.state.aestheticFocus || 'Estética';
  };

  const immediateActions = generateImmediateActions(getMainSpecialty());
  const allActions = [...immediateActions, ...mediumTermActions];

  const handleAddAllToPlanner = async () => {
    await addMultipleActionsToPlanner(allActions);
  };

  return (
    <div className="space-y-6">
      {/* Botão para adicionar tudo ao planejador */}
      <div className="flex justify-end">
        <Button
          onClick={handleAddAllToPlanner}
          disabled={isAdding}
          className="bg-aurora-gradient-primary hover:shadow-aurora-glow transition-all duration-300"
        >
          <Trello className="h-4 w-4 mr-2" />
          {isAdding ? "Criando Plano..." : "Enviar Tudo para o Planejador"}
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["immediate"]} className="space-y-4">
        {/* Ações Imediatas */}
        <AccordionItem value="immediate" className="aurora-card border-aurora-electric-purple/30 rounded-lg backdrop-blur-xl bg-gradient-to-br from-aurora-electric-purple/10 to-aurora-neon-blue/5 hover:shadow-aurora-glow transition-all duration-300">
          <AccordionTrigger className="px-6 py-4 hover:no-underline group">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-aurora-electric-purple/20 group-hover:bg-aurora-electric-purple/30 transition-colors">
                <Zap className="h-5 w-5 text-aurora-electric-purple group-hover:animate-pulse" />
              </div>
              <span className="text-lg font-semibold aurora-text-gradient">Ações Imediatas (Esta Semana)</span>
              <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/10 backdrop-blur-sm animate-pulse">
                Urgente
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-4">
              {immediateActions.map((action, index) => (
                <div key={index} className="aurora-glass border-aurora-electric-purple/20 rounded-lg p-4 hover:border-aurora-electric-purple/40 hover:shadow-aurora-glow-blue transition-all duration-300 group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-foreground group-hover:text-aurora-electric-purple transition-colors">{action.title}</h4>
                        <Badge variant="outline" className={`${getPriorityColor(action.priority)} backdrop-blur-sm`}>
                          {action.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground/70 mb-3 leading-relaxed">{action.description}</p>
                      <div className="flex items-center gap-4 text-xs text-foreground/60">
                        <span className="flex items-center gap-1">
                          ⏱️ <span className="text-aurora-sage">{action.time}</span>
                        </span>
                        <Badge variant="secondary" className="text-xs bg-aurora-deep-purple/20 border-aurora-deep-purple/30">
                          {action.category}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addActionToPlanner(action)}
                      disabled={isAdding}
                      className="ml-4 shrink-0 bg-aurora-glass border-aurora-electric-purple/30 hover:bg-aurora-electric-purple/20 hover:shadow-aurora-glow-blue transition-all duration-300"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Planejador
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Ações de Médio Prazo */}
        <AccordionItem value="medium" className="aurora-card border-aurora-sage/30 rounded-lg backdrop-blur-xl bg-gradient-to-br from-aurora-sage/10 to-aurora-emerald/5 hover:shadow-aurora-glow-emerald transition-all duration-300">
          <AccordionTrigger className="px-6 py-4 hover:no-underline group">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-aurora-sage/20 group-hover:bg-aurora-sage/30 transition-colors">
                <Calendar className="h-5 w-5 text-aurora-sage group-hover:animate-pulse" />
              </div>
              <span className="text-lg font-semibold text-foreground">Médio Prazo (30 dias)</span>
              <Badge variant="outline" className="border-aurora-sage/30 text-aurora-sage bg-aurora-sage/10 backdrop-blur-sm">
                Planejamento
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-4">
              {mediumTermActions.map((action, index) => (
                <div key={index} className="aurora-glass border-aurora-sage/20 rounded-lg p-4 hover:border-aurora-sage/40 hover:shadow-aurora-glow-emerald transition-all duration-300 group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-foreground group-hover:text-aurora-sage transition-colors">{action.title}</h4>
                        <Badge variant="outline" className={`${getPriorityColor(action.priority)} backdrop-blur-sm`}>
                          {action.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground/70 mb-3 leading-relaxed">{action.description}</p>
                      <div className="flex items-center gap-4 text-xs text-foreground/60">
                        <span className="flex items-center gap-1">
                          ⏱️ <span className="text-aurora-sage">{action.time}</span>
                        </span>
                        <Badge variant="secondary" className="text-xs bg-aurora-sage/20 border-aurora-sage/30">
                          {action.category}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addActionToPlanner(action)}
                      disabled={isAdding}
                      className="ml-4 shrink-0 bg-aurora-glass border-aurora-sage/30 hover:bg-aurora-sage/20 hover:shadow-aurora-glow-emerald transition-all duration-300"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Planejador
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Estratégia de Crescimento */}
        <AccordionItem value="growth" className="aurora-card border-aurora-lavender/30 rounded-lg backdrop-blur-xl bg-gradient-to-br from-aurora-lavender/10 to-aurora-deep-purple/5 hover:shadow-aurora-glow transition-all duration-300">
          <AccordionTrigger className="px-6 py-4 hover:no-underline group">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-aurora-lavender/20 group-hover:bg-aurora-lavender/30 transition-colors aurora-glow-intense">
                <Lightbulb className="h-5 w-5 text-aurora-lavender group-hover:animate-pulse" />
              </div>
              <span className="text-lg font-semibold text-foreground">Estratégia de Crescimento - {getMainSpecialty()}</span>
              <Badge variant="outline" className="border-aurora-lavender/30 text-aurora-lavender bg-aurora-lavender/10 backdrop-blur-sm animate-aurora-pulse">
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
      <div className="aurora-card border-aurora-deep-purple/30 rounded-lg backdrop-blur-xl bg-gradient-to-br from-aurora-deep-purple/10 to-aurora-electric-purple/5 p-6 hover:shadow-aurora-glow-intense transition-all duration-300">
        <ImplementationTips />
      </div>
    </div>
  );
};

export default ActionsTab;
