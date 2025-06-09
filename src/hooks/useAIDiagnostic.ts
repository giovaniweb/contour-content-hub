
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAIDiagnostic = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [diagnosticHistory, setDiagnosticHistory] = useState<any[]>([]);

  const generateDiagnostic = async (diagnosticData: any): Promise<string | null> => {
    setIsGenerating(true);
    
    try {
      console.log('🎯 Iniciando geração de diagnóstico via edge function consolidada');
      
      const { data, error } = await supabase.functions.invoke('generate-marketing-diagnostic', {
        body: diagnosticData
      });

      console.log('📡 Resposta da edge function consolidada:', { data, error });

      if (error) {
        console.error('❌ Erro na edge function:', error);
        return null;
      }

      if (!data.success) {
        console.error('❌ Edge function retornou erro:', data.error);
        if (data.fallback) {
          console.log('🔄 Usando fallback devido a:', data.error);
          return data.diagnostic; // Retorna mensagem de fallback
        }
        return null;
      }

      console.log('✅ Diagnóstico gerado com sucesso via IA consolidada');
      
      // Salvar no histórico se bem-sucedido
      await saveDiagnosticToHistory(diagnosticData, data.diagnostic, data);
      
      return data.diagnostic;
    } catch (error) {
      console.error('💥 Erro na geração do diagnóstico:', error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const saveDiagnosticToHistory = async (inputData: any, diagnostic: string, metadata: any) => {
    try {
      console.log('💾 Salvando diagnóstico no histórico...');
      
      const historyEntry = {
        clinic_type: inputData.clinicType,
        specialty: inputData.clinicType === 'clinica_medica' ? inputData.medicalSpecialty : inputData.aestheticFocus,
        diagnostic_content: diagnostic,
        input_data: inputData,
        model_used: metadata.model_used || 'gpt-4',
        equipments_validated: metadata.equipments_validated || [],
        success: metadata.success || false,
        created_at: new Date().toISOString()
      };

      // Adicionar ao histórico local
      setDiagnosticHistory(prev => [historyEntry, ...prev]);
      
      console.log('✅ Diagnóstico salvo no histórico com sucesso');
      
      toast.success('✅ Diagnóstico salvo no histórico', {
        description: 'Acesse o histórico para revisar todos os seus relatórios'
      });
      
    } catch (error) {
      console.error('❌ Erro ao salvar no histórico:', error);
      // Não falha a operação principal por erro de histórico
    }
  };

  const loadDiagnosticHistory = async () => {
    try {
      console.log('📚 Carregando histórico de diagnósticos...');
      // Por enquanto retorna histórico local
      // Futuramente pode implementar busca no Supabase
      return diagnosticHistory;
    } catch (error) {
      console.error('❌ Erro ao carregar histórico:', error);
      return [];
    }
  };

  return {
    generateDiagnostic,
    isGenerating,
    diagnosticHistory,
    loadDiagnosticHistory,
    saveDiagnosticToHistory
  };
};
