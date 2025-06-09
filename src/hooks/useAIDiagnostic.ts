
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAIDiagnostic = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [diagnosticHistory, setDiagnosticHistory] = useState<any[]>([]);

  const generateDiagnostic = async (diagnosticData: any): Promise<string | null> => {
    setIsGenerating(true);
    
    try {
      console.log('🎯 Iniciando geração de diagnóstico via edge function');
      console.log('📊 Dados enviados:', diagnosticData);
      
      // Timeout de 90 segundos
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: A geração está demorando mais que o esperado')), 90000);
      });
      
      const apiCall = supabase.functions.invoke('generate-marketing-diagnostic', {
        body: diagnosticData
      });
      
      const { data, error } = await Promise.race([apiCall, timeoutPromise]);

      console.log('📡 Resposta da edge function:', { data, error });

      if (error) {
        console.error('❌ Erro na edge function:', error);
        toast.error('Erro na geração do diagnóstico', {
          description: 'Tente novamente em alguns instantes'
        });
        return null;
      }

      if (!data?.success) {
        console.error('❌ Edge function retornou erro:', data?.error);
        
        if (data?.fallback) {
          console.log('🔄 Usando fallback devido a:', data.error);
          toast.warning('Usando versão simplificada', {
            description: 'A IA está temporariamente indisponível, mas geramos um diagnóstico básico'
          });
          return data.diagnostic;
        }
        
        toast.error('Falha na geração', {
          description: data?.error || 'Erro desconhecido na geração do diagnóstico'
        });
        return null;
      }

      console.log('✅ Diagnóstico gerado com sucesso');
      
      // Salvar no histórico se bem-sucedido
      await saveDiagnosticToHistory(diagnosticData, data.diagnostic, data);
      
      toast.success('Diagnóstico gerado com sucesso!', {
        description: 'Seu relatório personalizado está pronto'
      });
      
      return data.diagnostic;
    } catch (error: any) {
      console.error('💥 Erro na geração do diagnóstico:', error);
      
      // Tratar diferentes tipos de erro
      if (error.message?.includes('Timeout')) {
        toast.error('Timeout na geração', {
          description: 'A IA está demorando mais que o esperado. Tente novamente.'
        });
      } else if (error.message?.includes('fetch')) {
        toast.error('Erro de conexão', {
          description: 'Verifique sua conexão com a internet'
        });
      } else {
        toast.error('Erro na geração do diagnóstico', {
          description: 'Tente novamente em alguns instantes'
        });
      }
      
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
      
    } catch (error) {
      console.error('❌ Erro ao salvar no histórico:', error);
      // Não falha a operação principal por erro de histórico
    }
  };

  const loadDiagnosticHistory = async () => {
    try {
      console.log('📚 Carregando histórico de diagnósticos...');
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
