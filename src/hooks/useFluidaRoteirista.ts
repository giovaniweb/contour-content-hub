
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateScript } from '@/services/supabaseService';
import { useClinicSegmentation } from './useClinicSegmentation';
import { useDiagnosticPersistence } from './useDiagnosticPersistence';
import { supabase } from '@/integrations/supabase/client';
import { inferMentorFromAnswers } from '@/components/fluidaroteirista/utils/mentorInference';
import { buildSystemPrompt } from '@/components/fluidaroteirista/utils/promptBuilders';

interface FluidaScriptRequest {
  tema: string;
  equipamentos: string[];
  objetivo?: string;
  mentor?: string;
  formato?: 'carrossel' | 'stories_10x' | 'imagem';
  canal?: string;
  estilo?: string;
}

interface FluidaScriptResult {
  roteiro: string;
  formato: string;
  emocao_central: string;
  intencao: string;
  objetivo: string;
  mentor: string;
  equipamentos_utilizados?: any[];
  canal?: string;
}

// Interface para dados do diagnóstico
interface DiagnosticData {
  clinicType?: string;
  medicalSpecialty?: string;
  aestheticFocus?: string;
  medicalBestSeller?: string;
  aestheticBestSeller?: string;
  medicalTicket?: string;
  aestheticTicket?: string;
  targetAudience?: string;
  medicalClinicStyle?: string;
  aestheticClinicStyle?: string;
  communicationStyle?: string;
}

interface EquipmentData {
  id: string;
  nome: string;
  tecnologia: string;
  indicacoes: string;
  beneficios: string;
  diferenciais: string;
  categoria: string;
}

export const useFluidaRoteirista = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<FluidaScriptResult[]>([]);
  const { currentSession } = useDiagnosticPersistence();

  const fetchEquipmentDetails = async (equipmentNames: string[]): Promise<EquipmentData[]> => {
    if (!equipmentNames || equipmentNames.length === 0) {
      return [];
    }

    console.log('🔍 [useFluidaRoteirista] Buscando detalhes dos equipamentos:', equipmentNames);

    try {
      const { data: equipments, error } = await supabase
        .from('equipamentos')
        .select('id, nome, tecnologia, indicacoes, beneficios, diferenciais, categoria')
        .in('nome', equipmentNames)
        .eq('ativo', true);

      if (error) {
        console.error('❌ [useFluidaRoteirista] Erro ao buscar equipamentos:', error);
        return [];
      }

      if (!equipments || equipments.length === 0) {
        console.warn('⚠️ [useFluidaRoteirista] Nenhum equipamento encontrado para:', equipmentNames);
        return [];
      }

      console.log('✅ [useFluidaRoteirista] Equipamentos encontrados:', equipments.length);
      equipments.forEach(eq => {
        console.log(`📋 [useFluidaRoteirista] ${eq.nome}: ${eq.tecnologia}`);
      });

      return equipments;
    } catch (fetchError) {
      console.error('❌ [useFluidaRoteirista] Erro crítico ao buscar equipamentos:', fetchError);
      return [];
    }
  };

  const generateFluidaScript = async (request: FluidaScriptRequest): Promise<FluidaScriptResult[]> => {
    console.log('🎬 FLUIDAROTEIRISTA - Iniciando geração', request);
    console.log('📝 [useFluidaRoteirista] Formato recebido:', request.formato);
    
    setIsGenerating(true);
    
    try {
      // CRÍTICO: Buscar detalhes dos equipamentos ANTES de gerar
      const equipmentDetails = await fetchEquipmentDetails(request.equipamentos);
      
      if (request.equipamentos.length > 0 && equipmentDetails.length === 0) {
        console.error('❌ [useFluidaRoteirista] PROBLEMA CRÍTICO: Equipamentos selecionados mas não encontrados no banco');
        toast({
          title: "⚠️ Equipamentos não encontrados",
          description: `Os equipamentos ${request.equipamentos.join(', ')} não foram encontrados no sistema.`,
          variant: "destructive"
        });
        return [];
      }

      // CORREÇÃO CRÍTICA: Para Stories 10x, usar prompt específico da metodologia
      let systemPrompt: string;
      let userPrompt: string;

      if (request.formato === 'stories_10x') {
        console.log('🎯 [useFluidaRoteirista] Usando prompt Stories 10x específico');
        
        // Importar e usar o prompt específico do Stories 10x
        const { buildStories10xPrompt } = await import('@/components/fluidaroteirista/utils/stories10xPromptBuilder');
        const stories10xPrompts = buildStories10xPrompt(
          request.tema,
          equipmentDetails,
          request.objetivo || 'conectar',
          request.estilo || 'conversacional'
        );
        
        systemPrompt = stories10xPrompts.systemPrompt;
        userPrompt = stories10xPrompts.userPrompt;
      } else {
        // CORREÇÃO CRÍTICA: Preparar dados para inferência de mentor (outros formatos)
        const akinatorAnswers = {
          formato: request.formato || 'carrossel',
          objetivo: request.objetivo || 'atrair',
          estilo: request.estilo || 'criativo',
          canal: request.canal || 'instagram',
          tema: request.tema
        };

        console.log('🎯 [useFluidaRoteirista] Dados para inferência:', akinatorAnswers);

        // AGUARDAR corretamente a Promise do mentor
        const inferredMentorKey = await inferMentorFromAnswers(akinatorAnswers);
        console.log('🎯 [useFluidaRoteirista] Mentor inferido:', inferredMentorKey);

        // CORREÇÃO CRÍTICA: Usar buildSystemPrompt com sistema de técnicas
        systemPrompt = await buildSystemPrompt(
          equipmentDetails,
          'akinator',
          inferredMentorKey,
          {
            canal: request.canal || 'instagram',
            formato: request.formato || 'carrossel',
            objetivo: request.objetivo || 'atrair',
            estilo: request.estilo || 'criativo'
          }
        );

        userPrompt = `
        Tema: ${request.tema}
        Canal: ${request.canal || 'instagram'}
        Formato: ${request.formato || 'carrossel'}
        Objetivo: ${request.objetivo || 'atrair'}
        Estilo: ${request.estilo || 'criativo'}
        Equipamentos: ${equipmentDetails.map(eq => eq.nome).join(', ')}
        
        Crie o roteiro seguindo exatamente as especificações do formato selecionado.
        `;
      }

      console.log('📤 [useFluidaRoteirista] Enviando para API');
      console.log('🎯 [useFluidaRoteirista] Formato sendo enviado:', request.formato);
      console.log('🔧 [useFluidaRoteirista] Equipamentos:', equipmentDetails.map(eq => eq.nome));

      // Chamar API com dados corretos
      const response = await generateScript({
        type: 'fluidaroteirista',
        systemPrompt,
        userPrompt,
        topic: request.tema,
        equipment: equipmentDetails.map(eq => eq.nome).join(', '),
        additionalInfo: JSON.stringify({ 
          formato: request.formato,
          equipmentDetails,
          isStories10x: request.formato === 'stories_10x'
        }),
        tone: request.estilo || 'professional',
        marketingObjective: request.objetivo as any
      });

      console.log('📥 [useFluidaRoteirista] Resposta recebida:', response);

      // VALIDAÇÃO CRÍTICA: Verificar se equipamentos foram mencionados
      if (equipmentDetails.length > 0 && response.content) {
        const equipmentsMentioned = equipmentDetails.filter(eq => 
          response.content.toLowerCase().includes(eq.nome.toLowerCase())
        );
        
        console.log('🔍 [useFluidaRoteirista] Verificação de equipamentos:');
        console.log('📝 Esperados:', equipmentDetails.map(eq => eq.nome));
        console.log('✅ Mencionados:', equipmentsMentioned.map(eq => eq.nome));
        
        if (equipmentsMentioned.length < equipmentDetails.length) {
          const missing = equipmentDetails.filter(eq => 
            !equipmentsMentioned.some(mentioned => mentioned.nome === eq.nome)
          );
          
          console.error('❌ [useFluidaRoteirista] Equipamentos não mencionados:', missing.map(eq => eq.nome));
          
          toast({
            title: "⚠️ Equipamentos não incluídos",
            description: `Os equipamentos ${missing.map(eq => eq.nome).join(', ')} não foram mencionados no roteiro.`,
            variant: "destructive"
          });
        }
      }

      // Processar resposta baseada no formato
      let scriptResult: FluidaScriptResult;
      
      if (request.formato === 'stories_10x') {
        // Para Stories 10x, não tentar parsear como JSON - usar texto direto
        scriptResult = {
          roteiro: response.content,
          formato: 'stories_10x',
          emocao_central: 'engajamento',
          intencao: 'conectar',
          objetivo: request.objetivo || 'Criar comunidade ativa',
          mentor: 'Leandro Ladeira',
          equipamentos_utilizados: equipmentDetails,
          canal: request.canal || 'instagram'
        };
      } else {
        // Tentar parsear como JSON para outros formatos
        try {
          scriptResult = JSON.parse(response.content);
          scriptResult.equipamentos_utilizados = equipmentDetails;
          scriptResult.canal = request.canal || 'instagram';
          scriptResult.formato = request.formato || 'carrossel';
        } catch {
          // Fallback se não for JSON válido
          scriptResult = {
            roteiro: response.content,
            formato: request.formato || 'carrossel',
            emocao_central: 'confiança',
            intencao: 'atrair',
            objetivo: request.objetivo || 'Atrair novos clientes',
            mentor: 'Criativo',
            equipamentos_utilizados: equipmentDetails,
            canal: request.canal || 'instagram'
          };
        }
      }

      const results = [scriptResult];
      setResults(results);

      // CORREÇÃO: Melhorar mensagem de toast para Stories 10x
      const formatoDisplay = request.formato === 'stories_10x' ? 'Stories 10x (Leandro Ladeira)' : scriptResult.formato;

      toast({
        title: "🎬 Roteiro FLUIDA gerado!",
        description: `Criado: ${formatoDisplay}${equipmentDetails.length > 0 ? ` (${equipmentDetails.length} equipamento(s))` : ''}`,
      });

      return results;

    } catch (error) {
      console.error('❌ Erro no FLUIDAROTEIRISTA:', error);
      
      // Sistema de fallback
      const fallbackScript: FluidaScriptResult = {
        roteiro: `Roteiro não pôde ser gerado agora. Suas respostas foram salvas. 
        
        Sugestão básica: Fale sobre ${request.tema} e destaque os benefícios únicos dos seus tratamentos${request.equipamentos.length > 0 ? ` com ${request.equipamentos.join(' e ')}` : ''}.`,
        formato: request.formato || 'carrossel',
        emocao_central: 'confiança',
        intencao: 'educar',
        objetivo: 'Manter engajamento',
        mentor: 'Básico',
        equipamentos_utilizados: [],
        canal: request.canal || 'instagram'
      };

      setResults([fallbackScript]);

      toast({
        title: "⚠️ Modo Fallback",
        description: "Sistema básico ativado. Tente novamente em instantes.",
        variant: "destructive"
      });

      return [fallbackScript];

    } finally {
      setIsGenerating(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return {
    generateFluidaScript,
    isGenerating,
    results,
    clearResults
  };
};
