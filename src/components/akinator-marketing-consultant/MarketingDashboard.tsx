
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MarketingConsultantState } from './types';
import DiagnosticCards from './dashboard/DiagnosticCards';
import ContentIdeasSection from './dashboard/ContentIdeasSection';
import StrategicActionsSection from './dashboard/StrategicActionsSection';
import PersonalizedStrategiesSection from './dashboard/PersonalizedStrategiesSection';
import ActionButtons from './dashboard/ActionButtons';
import MentorSection from './dashboard/MentorSection';
import SpecialistsActivatedSection from './dashboard/SpecialistsActivatedSection';

interface MarketingDashboardProps {
  state: MarketingConsultantState;
  mentor: any;
  aiSections: any;
  onRestart: () => void;
}

const MarketingDashboard: React.FC<MarketingDashboardProps> = ({
  state,
  mentor,
  aiSections,
  onRestart
}) => {
  const renderAIDiagnosticSummary = () => {
    if (!aiSections?.diagnostico_estrategico) {
      return (
        <div className="text-sm text-foreground/60 italic">
          Diagnóstico sendo processado...
        </div>
      );
    }

    const text = aiSections.diagnostico_estrategico;
    const sentences = text.split('.').slice(0, 2);
    const summary = sentences.join('.') + (sentences.length > 0 ? '.' : '');

    return (
      <div className="space-y-2">
        <p className="text-sm text-foreground/80 leading-relaxed">
          {summary}
        </p>
        {text.length > summary.length && (
          <p className="text-xs text-aurora-electric-purple">
            Ver diagnóstico completo abaixo →
          </p>
        )}
      </div>
    );
  };

  const renderAIMentorSatire = (): string => {
    if (!mentor?.name) return "Você tem muito potencial com a estratégia certa!";
    
    const satires = [
      "transformaria esses dados em estratégias que convertem de verdade.",
      "olharia esses números e já saberia exatamente o que fazer.",
      "usaria essas informações para criar algo realmente impactante.",
      "veria oportunidades incríveis neste perfil de clínica."
    ];
    
    return satires[Math.floor(Math.random() * satires.length)];
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onRestart}
            className="aurora-glass border-aurora-electric-purple/30 text-aurora-electric-purple hover:bg-aurora-electric-purple/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Novo Diagnóstico
          </Button>
          <div>
            <h1 className="text-3xl font-bold aurora-heading">
              Diagnóstico Completo
            </h1>
            <p className="aurora-body text-lg">
              Estratégias personalizadas para sua clínica
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="aurora-glass border-aurora-electric-purple/30">
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
          <Button className="aurora-button">
            <Download className="h-4 w-4 mr-2" />
            Baixar PDF
          </Button>
        </div>
      </motion.div>

      {/* Cards de Diagnóstico */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DiagnosticCards 
          state={state} 
          aiSections={aiSections}
          renderAIDiagnosticSummary={renderAIDiagnosticSummary}
        />
      </motion.div>

      {/* Especialistas Ativados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <SpecialistsActivatedSection aiSections={aiSections} />
      </motion.div>

      {/* Mentor Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <MentorSection 
          mentor={mentor}
          renderAIMentorSatire={renderAIMentorSatire}
        />
      </motion.div>

      {/* Ideias de Conteúdo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <ContentIdeasSection aiSections={aiSections} />
      </motion.div>

      {/* Ações Estratégicas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <StrategicActionsSection aiSections={aiSections} />
      </motion.div>

      {/* Estratégias Personalizadas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <PersonalizedStrategiesSection aiSections={aiSections} />
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <ActionButtons onRestart={onRestart} />
      </motion.div>
    </div>
  );
};

export default MarketingDashboard;
