import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDiagnosticPersistence } from '@/hooks/useDiagnosticPersistence';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportHeader from '@/components/diagnostic-report/ReportHeader';
import QuickMetrics from '@/components/diagnostic-report/QuickMetrics';
import DiagnosticTab from '@/components/diagnostic-report/DiagnosticTab';
import ActionsTab from '@/components/diagnostic-report/ActionsTab';
import ContentTab from '@/components/diagnostic-report/ContentTab';
import MetricsTab from '@/components/diagnostic-report/MetricsTab';
import ReportPdfButton from "@/components/ui/ReportPdfButton";
import GenerateAuroraPdfButton from "@/components/ui/GenerateAuroraPdfButton";

// Função para gerar ID determinístico (mesma lógica do hook)
const generateDeterministicId = (data: any): string => {
  const clinicName = data.clinicName || data.clinic_name || data.state?.clinicName || 'unknown';
  const yearsInBusiness = data.yearsInBusiness || data.years_in_business || data.state?.yearsInBusiness || '1';
  const teamSize = data.teamSize || data.team_size || data.state?.teamSize || '1';
  const mainServices = data.mainServices || data.main_services || data.state?.mainServices || 'geral';
  const revenue = data.currentRevenue || data.revenue || data.state?.currentRevenue || '0';
  const clinicType = data.clinicType || data.clinic_type || data.state?.clinicType || 'geral';
  
  const content = `${clinicName}_${yearsInBusiness}_${teamSize}_${mainServices}_${revenue}_${clinicType}`;
  
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  const fixedTimestamp = Math.abs(hash) * 1000000;
  return `diagnostic_${Math.abs(hash)}_${fixedTimestamp}`;
};

const DiagnosticReport: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { savedDiagnostics, currentSession, findSessionById } = useDiagnosticPersistence();
  const [activeTab, setActiveTab] = useState('diagnostic');

  console.log('🏥 DiagnosticReport - Parâmetros:', { sessionId });
  console.log('🏥 DiagnosticReport - Estado:', { 
    savedDiagnosticsCount: savedDiagnostics.length,
    currentSessionId: currentSession?.id,
    searchingForId: sessionId
  });

  // Buscar a sessão pelo ID com múltiplas estratégias
  let session = null;
  
  if (sessionId) {
    // 1. Usar a função de busca melhorada do hook
    session = findSessionById(sessionId);
    
    // 2. Se ainda não encontrou, tentar conversão de dados legados em tempo real
    if (!session) {
      console.log('🔍 Tentando busca e conversão de dados legados em tempo real...');
      
      try {
        // Buscar dados legados diretamente
        const legacyData = localStorage.getItem('marketing_diagnostic_data');
        if (legacyData) {
          const parsed = JSON.parse(legacyData);
          console.log('📄 Dados legados encontrados:', parsed);
          
          // Converter usando a mesma lógica determinística
          const state = parsed.state || parsed;
          const generatedId = generateDeterministicId(state);
          
          console.log('🆔 ID gerado para dados legados:', generatedId);
          console.log('🔍 Comparando com ID buscado:', sessionId);
          
          if (generatedId === sessionId) {
            // Converter para DiagnosticSession
            let clinicTypeLabel = 'Clínica';
            let specialty = 'Geral';
            
            if (state.clinicType === 'clinica_medica' || state.clinic_type === 'clinica_medica') {
              clinicTypeLabel = 'Clínica Médica';
              specialty = state.medicalSpecialty || state.medical_specialty || 'Geral';
            } else if (state.clinicType === 'clinica_estetica' || state.clinic_type === 'clinica_estetica') {
              clinicTypeLabel = 'Clínica Estética';
              specialty = state.aestheticFocus || state.aesthetic_focus || 'Geral';
            }
            
            session = {
              id: generatedId,
              timestamp: parsed.timestamp || new Date('2024-01-01').toISOString(),
              state: state,
              isCompleted: true,
              clinicTypeLabel,
              specialty,
              isPaidData: true
            };
            
            console.log('✅ Sessão convertida de dados legados:', session);
          }
        }
      } catch (error) {
        console.error('❌ Erro ao tentar conversão em tempo real:', error);
      }
    }
  }

  console.log('🏥 DiagnosticReport - Sessão encontrada:', !!session);

  if (!session) {
    console.log('❌ DiagnosticReport - Sessão não encontrada');
    console.log('📊 Diagnósticos disponíveis:', savedDiagnostics.map(d => ({ id: d.id, timestamp: d.timestamp })));
    
    // Debug adicional - mostrar dados do localStorage
    try {
      const legacyData = localStorage.getItem('marketing_diagnostic_data');
      console.log('📄 Dados legados no localStorage:', legacyData ? JSON.parse(legacyData) : null);
      
      if (legacyData) {
        const parsed = JSON.parse(legacyData);
        const testId = generateDeterministicId(parsed);
        console.log('🧪 Teste - ID que seria gerado:', testId);
      }
    } catch (e) {
      console.error('❌ Erro ao verificar dados legados:', e);
    }
    
    return (
      <div className="min-h-screen bg-aurora-background">
        <div className="container mx-auto py-6">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-foreground">Relatório não encontrado</h1>
            <p className="text-foreground/60">
              O relatório solicitado (ID: {sessionId}) não foi encontrado.
            </p>
            <div className="text-sm text-foreground/40">
              <p>Diagnósticos disponíveis: {savedDiagnostics.length}</p>
              <p>Sessão atual: {currentSession ? 'Existe' : 'Não existe'}</p>
              <p>ID buscado: {sessionId}</p>
            </div>
            <button 
              onClick={() => navigate('/diagnostic-history')}
              className="px-4 py-2 bg-aurora-electric-purple text-white rounded hover:bg-aurora-electric-purple/80"
            >
              Voltar ao Histórico
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate('/diagnostic-history');
  };

  // Novo: checar se temos URL PDF válida
  const pdfUrl = typeof session.state.generatedDiagnostic === "string"
    && session.state.generatedDiagnostic.startsWith("http")
      ? session.state.generatedDiagnostic
      : undefined;

  // Adicionar checagem se há diagnóstico exportável
  const diagnosticString = typeof session.state.generatedDiagnostic === "string"
    ? session.state.generatedDiagnostic
    : "";

  // Separar as seções para exportar (caso diagnóstico em texto esteja disponível)
  let diagnosticSections = { estrategico: '', planoAcao: '', conteudo: '' };
  try {
    if (diagnosticString.length > 10) {
      const { extractDiagnosticSections } = require("@/components/diagnostic-report/diagnostic-sections/diagnosticSectionUtils");
      diagnosticSections = extractDiagnosticSections(diagnosticString);
    }
  } catch (e) {
    // fallback se não conseguir importar
  }

  return (
    <div className="min-h-screen bg-aurora-background">
      <div className="container mx-auto py-6 max-w-6xl">

        {/* Header do relatório */}
        <ReportHeader session={session} onBack={handleBack} />

        {/* Botão PDF Aurora (URL já existente) */}
        {pdfUrl && (
          <div className="my-4">
            <ReportPdfButton
              pdfUrl={pdfUrl}
              diagnosticTitle={session.clinicTypeLabel}
            />
            <span className="ml-3 text-xs text-foreground/40">
              Baixe ou visualize o PDF Aurora Boreal do diagnóstico.
            </span>
          </div>
        )}

        {/* Métricas rápidas */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Métricas Principais</h2>
          <QuickMetrics state={session.state} />
        </div>

        {/* Conteúdo chave do relatório - ENCAPSULADO NA DIV PARA EXPORTAÇÃO */}
        <div id="diagnostic-report-html-capture">
          {/* Tabs de conteúdo */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 aurora-glass">
              <TabsTrigger value="diagnostic" className="text-sm">
                🎯 Diagnóstico
              </TabsTrigger>
              <TabsTrigger value="actions" className="text-sm">
                ⚡ Ações
              </TabsTrigger>
              <TabsTrigger value="content" className="text-sm">
                📝 Conteúdo
              </TabsTrigger>
              <TabsTrigger value="metrics" className="text-sm">
                📊 Métricas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="diagnostic">
              <DiagnosticTab session={session} />
            </TabsContent>

            <TabsContent value="actions">
              <ActionsTab session={session} />
            </TabsContent>

            <TabsContent value="content">
              <ContentTab session={session} />
            </TabsContent>

            <TabsContent value="metrics">
              <MetricsTab session={session} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticReport;
