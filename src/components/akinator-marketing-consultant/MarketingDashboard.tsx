
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
import FluidAnalysisCards from './dashboard/FluidAnalysisCards';
import ClinicTypeIndicator from './dashboard/ClinicTypeIndicator';
import ActiveStrategiesSection from './dashboard/ActiveStrategiesSection';
import ActionPlanSection from './dashboard/ActionPlanSection';
import RevenueProjectionCard from './dashboard/RevenueProjectionCard';

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
            Ver análise completa abaixo →
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

  const cleanText = (text: string): string => {
    return text.replace(/[*#]+/g, '').trim();
  };

  const formatTitle = (text: string): string => {
    const cleaned = cleanText(text);
    return cleaned.length > 80 ? cleaned.substring(0, 80) + '...' : cleaned;
  };

  const handleCreateScript = () => {
    console.log('Criar roteiro');
  };

  const handleGenerateImage = () => {
    console.log('Gerar imagem');
  };

  const handleDownloadPDF = () => {
    console.log('Download PDF');
  };

  // Prepare aiSections with safe defaults and mock data for demonstration
  const safeAiSections = {
    diagnostico_estrategico: aiSections?.diagnostico_estrategico || state.generatedDiagnostic || 
      'Análise profunda dos dados da clínica realizada. Identificamos oportunidades estratégicas de crescimento baseadas no perfil específico da sua clínica.',
    ativacao_especialistas: aiSections?.ativacao_especialistas || 
      'Especialistas ativados para análise completa da estratégia de marketing da clínica.',
    sugestoes_conteudo: aiSections?.sugestoes_conteudo || [
      'Criação de conteúdo educativo sobre procedimentos estéticos',
      'Posts sobre cuidados pós-procedimento para engajamento',
      'Stories mostrando antes e depois dos tratamentos',
      'Vídeos explicativos sobre equipamentos utilizados',
      'Depoimentos de clientes satisfeitos',
      'Dicas de skincare para diferentes tipos de pele'
    ],
    acoes_estrategicas: aiSections?.acoes_estrategicas || [
      'Implementar estratégia de conteúdo educativo nas redes sociais',
      'Criar campanha de depoimentos de clientes',
      'Desenvolver programa de fidelização de pacientes',
      'Otimizar presença digital com SEO local'
    ],
    estrategias: aiSections?.estrategias || [
      'Estratégia de diferenciação baseada em expertise técnica',
      'Programa de educação continuada para clientes',
      'Sistema de follow-up pós-procedimento automatizado'
    ]
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header with Clinic Type Indicator */}
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
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold aurora-heading">
                ✨ Fluida Diagnóstico Pro
              </h1>
              <ClinicTypeIndicator clinicType={state.clinicType || 'clinica_estetica'} />
            </div>
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
          aiSections={safeAiSections}
          renderAIDiagnosticSummary={renderAIDiagnosticSummary}
        />
      </motion.div>

      {/* Revenue Projection */}
      {state.currentRevenue && state.revenueGoal && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <RevenueProjectionCard 
            currentRevenue={state.currentRevenue}
            revenueGoal={state.revenueGoal}
            clinicType={state.clinicType || 'clinica_estetica'}
          />
        </motion.div>
      )}

      {/* Estratégias Ativas (substituindo Especialistas Ativados) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ActiveStrategiesSection 
          aiSections={safeAiSections} 
          clinicType={state.clinicType || 'clinica_estetica'} 
        />
      </motion.div>

      {/* Plano de Ação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ActionPlanSection clinicType={state.clinicType || 'clinica_estetica'} />
      </motion.div>

      {/* Ideias de Conteúdo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <ContentIdeasSection 
          aiSections={safeAiSections}
          cleanText={cleanText}
          formatTitle={formatTitle}
        />
      </motion.div>

      {/* Mentor Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <MentorSection 
          mentor={mentor}
          renderAIMentorSatire={renderAIMentorSatire}
        />
      </motion.div>

      {/* Estratégias Personalizadas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <PersonalizedStrategiesSection 
          aiSections={safeAiSections}
          formatTitle={formatTitle}
        />
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <ActionButtons 
          onCreateScript={handleCreateScript}
          onGenerateImage={handleGenerateImage}
          onDownloadPDF={handleDownloadPDF}
        />
      </motion.div>
    </div>
  );
};

export default MarketingDashboard;
