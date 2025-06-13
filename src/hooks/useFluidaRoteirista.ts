
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateScript } from '@/services/supabaseService';
import { useClinicSegmentation } from './useClinicSegmentation';
import { useDiagnosticPersistence } from './useDiagnosticPersistence';
import { supabase } from '@/integrations/supabase/client';

interface FluidaScriptRequest {
  tema: string;
  equipamentos: string[];
  objetivo?: string;
  mentor?: string;
  formato?: 'carrossel' | 'stories' | 'imagem' | 'reels';
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

      // Usar dados do diagnóstico se disponível
      const diagnosticData: DiagnosticData = currentSession?.state || {};
      const clinicType = diagnosticData.clinicType || 'estetico';
      
      // Construir contexto enriquecido
      const enrichedContext = {
        tipo_de_clinica: clinicType,
        especialidade: diagnosticData.medicalSpecialty || diagnosticData.aestheticFocus || '',
        equipamentos: equipmentDetails.map(eq => eq.nome).join(', '),
        protocolo: diagnosticData.medicalBestSeller || diagnosticData.aestheticBestSeller || '',
        ticket_medio: diagnosticData.medicalTicket || diagnosticData.aestheticTicket || '',
        publico_ideal: diagnosticData.targetAudience || '',
        estilo_clinica: diagnosticData.medicalClinicStyle || diagnosticData.aestheticClinicStyle || '',
        estilo_linguagem: diagnosticData.communicationStyle || '',
        mentor_nome: request.mentor || 'Criativo'
      };

      // Prompt FLUIDAROTEIRISTA com integração de equipamentos
      const systemPrompt = `
        Você é o FLUIDAROTEIRISTA — roteirista oficial da plataforma para clínicas estéticas e médicas.
        
        Sua missão é gerar roteiros criativos, impactantes e prontos para redes sociais.
        
        Contexto da clínica:
        - Tipo: ${enrichedContext.tipo_de_clinica}
        - Especialidade: ${enrichedContext.especialidade}
        - Equipamentos: ${enrichedContext.equipamentos}
        - Protocolo mais vendido: ${enrichedContext.protocolo}
        - Ticket médio: ${enrichedContext.ticket_medio}
        - Público ideal: ${enrichedContext.publico_ideal}
        - Estilo da clínica: ${enrichedContext.estilo_clinica}
        - Mentor: ${enrichedContext.mentor_nome}
        
        ${equipmentDetails.length > 0 ? `
        🚨 EQUIPAMENTOS OBRIGATÓRIOS (MENCIONE TODOS):
        ${equipmentDetails.map((eq, index) => `${index + 1}. ${eq.nome}: ${eq.tecnologia}
           - Benefícios: ${eq.beneficios}
           - Diferenciais: ${eq.diferenciais}`).join('\n')}
        
        🔥 REGRA CRÍTICA: O roteiro DEVE mencionar ESPECIFICAMENTE cada um destes equipamentos pelo nome.
        ⚠️ Se você não mencionar os equipamentos listados, o roteiro será rejeitado.
        ` : ''}
        
        ESTRUTURA OBRIGATÓRIA:
        1. Gancho (capturar atenção)
        2. Conflito (apresentar problema)
        3. Virada (mostrar solução com equipamentos específicos)
        4. CTA (chamada para ação)
        
        FORMATO: ${request.formato || 'carrossel'}
        
        Retorne APENAS JSON válido:
        {
          "roteiro": "Conteúdo do roteiro",
          "formato": "carrossel/stories/imagem",
          "emocao_central": "esperança/confiança/urgência/etc",
          "intencao": "atrair/vender/educar/conectar",
          "objetivo": "Objetivo específico do post",
          "mentor": "Nome do mentor usado"
        }
      `;

      const userPrompt = `
        Tema: ${request.tema}
        Canal: ${request.canal || 'instagram'}
        Formato: ${request.formato || 'carrossel'}
        Objetivo: ${request.objetivo || 'atrair'}
        Estilo: ${request.estilo || 'cientifico'}
        Equipamentos: ${equipmentDetails.map(eq => eq.nome).join(', ')}
        
        Crie o roteiro seguindo exatamente as especificações do formato selecionado.
      `;

      console.log('📤 [useFluidaRoteirista] Enviando para API com equipamentos:', equipmentDetails.map(eq => eq.nome));

      // FIX: Convert equipment array to string for the API call
      const response = await generateScript({
        type: 'fluidaroteirista',
        systemPrompt,
        userPrompt,
        topic: request.tema,
        equipment: equipmentDetails.map(eq => eq.nome).join(', '), // Convert array to comma-separated string
        additionalInfo: JSON.stringify({ 
          ...enrichedContext,
          equipmentDetails // Passar detalhes completos
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
            description: `Os equipamentos ${missing.map(eq => eq.nome).join(', ')} não foram mencionados no roteiro. Tentando novamente...`,
            variant: "destructive"
          });
          
          // Por enquanto, vamos continuar mas alertar o usuário
          console.warn('⚠️ [useFluidaRoteirista] Continuando com roteiro incompleto');
        }
      }

      // Tentar parsear como JSON
      let scriptResult: FluidaScriptResult;
      try {
        scriptResult = JSON.parse(response.content);
        scriptResult.equipamentos_utilizados = equipmentDetails;
        scriptResult.canal = request.canal || 'instagram';
      } catch {
        // Fallback se não for JSON válido
        scriptResult = {
          roteiro: response.content,
          formato: request.formato || 'carrossel',
          emocao_central: 'confiança',
          intencao: 'atrair',
          objetivo: request.objetivo || 'Atrair novos clientes',
          mentor: request.mentor || 'Criativo',
          equipamentos_utilizados: equipmentDetails,
          canal: request.canal || 'instagram'
        };
      }

      const results = [scriptResult];
      setResults(results);

      toast({
        title: "🎬 Roteiro FLUIDA gerado!",
        description: `Criado com ${scriptResult.mentor} - ${scriptResult.formato}${equipmentDetails.length > 0 ? ` (${equipmentDetails.length} equipamento(s))` : ''}`,
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
