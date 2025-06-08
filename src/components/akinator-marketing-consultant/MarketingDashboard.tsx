
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { MarketingConsultantState } from './types';
import { MarketingMentorInference } from './mentorInference';
import { parseAIDiagnostic, cleanText, formatTitle } from './dashboard/utils';
import DiagnosticCards from './dashboard/DiagnosticCards';
import ContentIdeasSection from './dashboard/ContentIdeasSection';
import StrategicActionsSection from './dashboard/StrategicActionsSection';
import PersonalizedStrategiesSection from './dashboard/PersonalizedStrategiesSection';
import MentorSection from './dashboard/MentorSection';
import ActionButtons from './dashboard/ActionButtons';

interface MarketingDashboardProps {
  state: MarketingConsultantState;
  onBack: () => void;
  onCreateScript: () => void;
  onGenerateImage: () => void;
  onDownloadPDF: () => void;
  onViewHistory?: () => void;
}

const MarketingDashboard: React.FC<MarketingDashboardProps> = ({
  state,
  onBack,
  onCreateScript,
  onGenerateImage,
  onDownloadPDF,
  onViewHistory
}) => {
  const aiSections = parseAIDiagnostic(state.generatedDiagnostic || '');
  
  // Inferir mentor baseado no perfil
  const { mentor, enigma } = MarketingMentorInference.inferMentor(state);

  const renderAIDiagnosticSummary = () => {
    if (!aiSections || !aiSections.diagnostico) {
      return (
        <div className="text-foreground/80 text-sm">
          <p>📊 Diagnóstico sendo processado pela IA...</p>
          <p className="text-xs mt-1 text-foreground/60">Dados disponíveis, gerando insights personalizados</p>
        </div>
      );
    }

    // Pegar as primeiras linhas mais significativas do diagnóstico
    const lines = aiSections.diagnostico.split('\n').filter(line => line.trim().length > 20);
    const summaryLines = lines.slice(0, 3);
    
    return (
      <div className="space-y-2">
        {summaryLines.map((line, index) => (
          <p key={index} className="text-sm text-foreground/80 leading-relaxed">
            {line.replace(/[•\-\*]/g, '').trim()}
          </p>
        ))}
        {summaryLines.length === 0 && (
          <p className="text-sm text-foreground/80">
            Análise personalizada baseada no perfil da clínica e objetivos definidos.
          </p>
        )}
      </div>
    );
  };

  const renderAIMentorSatire = () => {
    if (!aiSections || !aiSections.satira) {
      return enigma; // Fallback para o enigma padrão
    }

    return cleanText(aiSections.satira);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 text-foreground hover:text-aurora-electric-purple">
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Diagnóstico
        </Button>
        <Badge variant="outline" className="aurora-gradient-bg text-white border-aurora-electric-purple/50">
          Dashboard Estratégico Fluida
        </Badge>
      </div>

      {/* Diagnóstico em Cards */}
      <DiagnosticCards 
        state={state}
        aiSections={aiSections}
        renderAIDiagnosticSummary={renderAIDiagnosticSummary}
      />

      {/* Ideias de Conteúdo da IA */}
      <ContentIdeasSection 
        aiSections={aiSections}
        cleanText={cleanText}
        formatTitle={formatTitle}
      />

      {/* Estratégias Personalizadas da IA */}
      <PersonalizedStrategiesSection 
        aiSections={aiSections}
        formatTitle={formatTitle}
      />

      {/* Ações Estratégicas da IA */}
      <StrategicActionsSection 
        aiSections={aiSections}
        cleanText={cleanText}
        formatTitle={formatTitle}
      />

      {/* Mentor Identificado e Enigma da IA */}
      <MentorSection 
        mentor={mentor}
        renderAIMentorSatire={renderAIMentorSatire}
      />

      {/* CTAs Finais */}
      <ActionButtons 
        onCreateScript={onCreateScript}
        onGenerateImage={onGenerateImage}
        onDownloadPDF={onDownloadPDF}
        onViewHistory={onViewHistory}
      />
    </div>
  );
};

export default MarketingDashboard;
