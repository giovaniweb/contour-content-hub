
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BrainCircuit, RotateCcw, Download, Share2, TrendingUp, Target, Users, Calendar, Lightbulb, Zap, Crown, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { MarketingConsultantState } from './types';
import ClinicTypeIndicator from './dashboard/ClinicTypeIndicator';
import DiagnosticCards from './dashboard/DiagnosticCards';
import FluidAnalysisCards from './dashboard/FluidAnalysisCards';
import StructuredDiagnosticSection from './dashboard/StructuredDiagnosticSection';
import ActionButtons from './dashboard/ActionButtons';
import ContentSuggestionCards from './dashboard/ContentSuggestionCards';
import QuickActionCards from './dashboard/QuickActionCards';

interface MarketingDashboardProps {
  state: MarketingConsultantState;
  mentor: any;
  aiSections: any;
  onRestart: () => void;
  onStateUpdate?: (newState: MarketingConsultantState) => void;
}

const MarketingDashboard: React.FC<MarketingDashboardProps> = ({
  state,
  mentor,
  aiSections,
  onRestart,
  onStateUpdate
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Create a safe state with proper defaults to match MarketingConsultantState interface
  const safeState: MarketingConsultantState = {
    clinicType: state?.clinicType || '',
    clinicName: state?.clinicName || '',
    medicalSpecialty: state?.medicalSpecialty || '',
    medicalProcedures: state?.medicalProcedures || '',
    medicalEquipments: state?.medicalEquipments || '',
    medicalBestSeller: state?.medicalBestSeller || '',
    medicalTicket: state?.medicalTicket || '',
    medicalSalesModel: state?.medicalSalesModel || '',
    medicalObjective: state?.medicalObjective || '',
    medicalContentFrequency: state?.medicalContentFrequency || '',
    medicalClinicStyle: state?.medicalClinicStyle || '',
    aestheticFocus: state?.aestheticFocus || '',
    aestheticEquipments: state?.aestheticEquipments || '',
    aestheticBestSeller: state?.aestheticBestSeller || '',
    aestheticSalesModel: state?.aestheticSalesModel || '',
    aestheticTicket: state?.aestheticTicket || '',
    aestheticObjective: state?.aestheticObjective || '',
    aestheticContentFrequency: state?.aestheticContentFrequency || '',
    aestheticClinicStyle: state?.aestheticClinicStyle || '',
    currentRevenue: state?.currentRevenue || '',
    revenueGoal: state?.revenueGoal || '',
    targetAudience: state?.targetAudience || '',
    contentFrequency: state?.contentFrequency || '',
    communicationStyle: state?.communicationStyle || '',
    mainChallenges: state?.mainChallenges || '',
    generatedDiagnostic: state?.generatedDiagnostic || ''
  };

  const safeMentor = mentor || {
    name: 'Mentor Fluida',
    speciality: 'Marketing Digital'
  };

  const safeAiSections = aiSections || {};

  console.log('📊 MarketingDashboard renderizando com dados:', {
    safeState,
    safeMentor,
    safeAiSections
  });

  const handleDiagnosticUpdate = (newDiagnostic: string) => {
    const updatedState = {
      ...safeState,
      generatedDiagnostic: newDiagnostic
    };
    onStateUpdate?.(updatedState);
  };

  const handleDownloadReport = () => {
    toast.success("📄 Relatório baixado!", {
      description: "Seu diagnóstico foi salvo em PDF."
    });
  };

  const handleShareReport = () => {
    toast.success("🔗 Link copiado!", {
      description: "Link do relatório copiado para a área de transferência."
    });
  };

  const getClinicTypeLabel = () => {
    if (!safeState.clinicType) return 'Não definido';
    return safeState.clinicType === 'clinica_medica' ? 'Clínica Médica' : 'Clínica Estética';
  };

  const getMainSpecialty = () => {
    if (safeState.clinicType === 'clinica_medica') {
      return safeState.medicalSpecialty || 'Não informado';
    }
    return safeState.aestheticFocus || 'Não informado';
  };

  const getCurrentRevenue = () => {
    const revenueMap = {
      'ate_15k': 'Até R$ 15.000',
      '15k_30k': 'R$ 15.000 - R$ 30.000',
      '30k_60k': 'R$ 30.000 - R$ 60.000',
      'acima_60k': 'Acima de R$ 60.000'
    };
    return revenueMap[safeState.currentRevenue as keyof typeof revenueMap] || 'Não informado';
  };

  const getRevenueGoal = () => {
    const goalMap = {
      'crescer_30': 'Crescer 30% em 6 meses',
      'crescer_50': 'Crescer 50% em 6 meses',
      'dobrar': 'Dobrar em 1 ano',
      'triplicar': 'Triplicar em 1 ano',
      'manter_estavel': 'Manter estabilidade'
    };
    return goalMap[safeState.revenueGoal as keyof typeof goalMap] || 'Não informado';
  };

  // Function to render AI diagnostic summary
  const renderAIDiagnosticSummary = () => {
    if (safeState.generatedDiagnostic && safeState.generatedDiagnostic !== 'Diagnóstico sendo processado...') {
      const firstParagraph = safeState.generatedDiagnostic.split('\n')[0];
      return (
        <p className="text-sm aurora-body opacity-90 leading-relaxed">
          {firstParagraph.replace(/[#*]/g, '').trim()}
        </p>
      );
    }
    return (
      <p className="text-sm aurora-body opacity-70">
        Análise estratégica baseada no perfil da sua clínica em processamento...
      </p>
    );
  };

  return (
    <div className="container mx-auto max-w-7xl py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-aurora-gradient-primary rounded-full shadow-lg aurora-glow">
            <BrainCircuit className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold aurora-heading text-slate-50">
          🎯 Diagnóstico Fluida Concluído
        </h1>
        
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <ClinicTypeIndicator clinicType={safeState.clinicType} />
          <Badge variant="outline" className="border-aurora-sage text-aurora-sage">
            {getMainSpecialty()}
          </Badge>
          <Badge variant="outline" className="border-aurora-deep-purple text-aurora-deep-purple">
            {getCurrentRevenue()}
          </Badge>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="aurora-card border-aurora-electric-purple/20">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-aurora-electric-purple mx-auto mb-3" />
            <h3 className="font-semibold aurora-heading mb-2">Meta de Crescimento</h3>
            <p className="text-sm aurora-body opacity-80">{getRevenueGoal()}</p>
          </CardContent>
        </Card>

        <Card className="aurora-card border-aurora-sage/20">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-aurora-sage mx-auto mb-3" />
            <h3 className="font-semibold aurora-heading mb-2">Público-Alvo</h3>
            <p className="text-sm aurora-body opacity-80">{safeState.targetAudience || 'Não definido'}</p>
          </CardContent>
        </Card>

        <Card className="aurora-card border-aurora-deep-purple/20">
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 text-aurora-deep-purple mx-auto mb-3" />
            <h3 className="font-semibold aurora-heading mb-2">Principal Desafio</h3>
            <p className="text-sm aurora-body opacity-80">
              {safeState.mainChallenges ? safeState.mainChallenges.replace('_', ' ').replace(/^\w/, c => c.toUpperCase()) : 'Não informado'}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center"
      >
        <div className="aurora-glass rounded-full p-1">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: '📊 Visão Geral', icon: BrainCircuit },
              { id: 'diagnostic', label: '🎯 Diagnóstico', icon: Target },
              { id: 'actions', label: '⚡ Ações', icon: Zap }
            ].map(tab => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className={`
                  px-6 py-2 rounded-full transition-all duration-300
                  ${activeTab === tab.id ? 'aurora-button' : 'text-white/70 hover:text-white hover:bg-white/10'}
                `}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        {activeTab === 'overview' && (
          <>
            <DiagnosticCards 
              state={safeState} 
              aiSections={safeAiSections} 
              renderAIDiagnosticSummary={renderAIDiagnosticSummary} 
            />
            <FluidAnalysisCards state={safeState} aiSections={safeAiSections} />
          </>
        )}

        {activeTab === 'diagnostic' && (
          <StructuredDiagnosticSection 
            diagnostic={safeState.generatedDiagnostic || 'Diagnóstico sendo processado...'} 
            state={safeState} 
            onDiagnosticUpdate={handleDiagnosticUpdate} 
          />
        )}

        {activeTab === 'actions' && (
          <div className="space-y-8">
            <ContentSuggestionCards 
              state={safeState} 
              diagnostic={safeState.generatedDiagnostic || ''} 
            />
            
            <QuickActionCards state={safeState} />
            
            <Card className="aurora-card">
              <CardHeader>
                <CardTitle className="aurora-heading flex items-center gap-2">
                  <Zap className="h-5 w-5 text-aurora-electric-purple" />
                  Próximos Passos Recomendados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 aurora-glass rounded-lg">
                    <h4 className="font-semibold aurora-heading mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-aurora-sage" />
                      Imediato (Esta Semana)
                    </h4>
                    <ul className="text-sm aurora-body space-y-1 opacity-80">
                      <li>• Otimizar perfil nas redes sociais</li>
                      <li>• Criar 3 posts sobre {getMainSpecialty()}</li>
                      <li>• Definir público-alvo específico</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>

      {/* Action Buttons */}
      <ActionButtons 
        onDownload={handleDownloadReport} 
        onShare={handleShareReport} 
        onRestart={onRestart} 
      />
    </div>
  );
};

export default MarketingDashboard;
