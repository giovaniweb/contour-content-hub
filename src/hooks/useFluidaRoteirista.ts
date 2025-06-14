
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

      // PROMPT CRÍTICO CORRIGIDO para Stories 10x
      let systemPrompt = '';
      
      if (request.formato === 'stories') {
        systemPrompt = `
        Você é o FLUIDAROTEIRISTA especializado em STORIES 10X.
        
        🚨 REGRA CRÍTICA ABSOLUTA: EXATAMENTE 4 STORIES - SEM EXCEÇÕES
        
        INSTRUÇÕES OBRIGATÓRIAS:
        1. Sempre retorne EXATAMENTE 4 stories numerados: Story 1:, Story 2:, Story 3:, Story 4:
        2. Cada story deve ter conteúdo específico e único
        3. NUNCA retorne menos de 4 stories
        4. NUNCA retorne mais de 4 stories
        5. Use dispositivos de engajamento (🔥, 📊, ❓)
        
        ${equipmentDetails.length > 0 ? `
        EQUIPAMENTOS OBRIGATÓRIOS A MENCIONAR:
        ${equipmentDetails.map(eq => `- ${eq.nome}: ${eq.tecnologia} - ${eq.beneficios}`).join('\n')}
        
        REGRA: Mencione pelo menos um equipamento no Story 3.
        ` : ''}
        
        ESTRUTURA OBRIGATÓRIA:
        Story 1: Gancho provocativo que para o scroll
        Story 2: Erro comum que todos cometem  
        Story 3: Virada com solução + dispositivo engajamento + equipamento
        Story 4: CTA suave + antecipação
        
        FORMATO DE SAÍDA OBRIGATÓRIO:
        {
          "roteiro": "Story 1: [Título]\\n[Conteúdo completo do story 1]\\n\\nStory 2: [Título]\\n[Conteúdo completo do story 2]\\n\\nStory 3: [Título]\\n[Conteúdo completo do story 3 com equipamento]\\n\\nStory 4: [Título]\\n[Conteúdo completo do story 4]",
          "formato": "stories"
        }
        
        VALIDAÇÃO FINAL: Conte quantos "Story X:" existem. DEVE ser exatamente 4.
        `;
      } else if (request.formato === 'carrossel') {
        systemPrompt = `
        Você é o FLUIDAROTEIRISTA especializado em CARROSSEL INSTAGRAM.
        
        🚨 REGRA CRÍTICA: EXATAMENTE 5 SLIDES COM ESTRUTURA ESPECÍFICA
        
        ${equipmentDetails.length > 0 ? `
        EQUIPAMENTOS OBRIGATÓRIOS A MENCIONAR:
        ${equipmentDetails.map(eq => `- ${eq.nome}: ${eq.tecnologia} - ${eq.beneficios}`).join('\n')}
        
        REGRA: Mencione equipamentos pelo nome real no Slide 3.
        ` : ''}
        
        ESTRUTURA OBRIGATÓRIA PARA CADA SLIDE:
        Slide: [Título Descritivo]
        Texto: [Conteúdo específico em até 25 palavras]
        Imagem: [Descrição visual detalhada com pelo menos 15 palavras específicas]
        
        SLIDES OBRIGATÓRIOS:
        1. Slide: Gancho - capturar atenção
        2. Slide: O Problema - apresentar desafio
        3. Slide: Nossa Solução - mostrar equipamento/tratamento
        4. Slide: Benefícios - evidenciar resultados
        5. Slide: Call to Action - CTA forte
        
        FORMATO DE SAÍDA:
        {
          "roteiro": "Slide: Gancho\\nTexto: [texto específico]\\nImagem: [descrição específica]\\n\\nSlide: O Problema\\nTexto: [texto específico]\\nImagem: [descrição específica]\\n\\nSlide: Nossa Solução\\nTexto: [texto com equipamento real]\\nImagem: [descrição com equipamento]\\n\\nSlide: Benefícios\\nTexto: [benefícios específicos]\\nImagem: [resultado visual]\\n\\nSlide: Call to Action\\nTexto: [CTA direto]\\nImagem: [ambiente convidativo]",
          "formato": "carrossel"
        }
        `;
      } else {
        // Prompt genérico para outros formatos
        systemPrompt = `
        Você é o FLUIDAROTEIRISTA criativo.
        
        ${equipmentDetails.length > 0 ? `
        Equipamentos disponíveis: ${equipmentDetails.map(eq => eq.nome).join(', ')}
        Mencione os equipamentos no roteiro.
        ` : ''}
        
        Crie um roteiro para ${request.formato} sobre: ${request.tema}
        
        Retorne JSON: {"roteiro": "conteúdo", "formato": "${request.formato}"}
        `;
      }

      const userPrompt = `
        Tema: ${request.tema}
        Formato: ${request.formato}
        Objetivo: ${request.objetivo || 'atrair'}
        Estilo: ${request.estilo || 'criativo'}
        Equipamentos selecionados: ${equipmentDetails.map(eq => eq.nome).join(', ')}
        
        Crie o roteiro seguindo EXATAMENTE as especificações do formato.
      `;

      console.log('📤 [useFluidaRoteirista] Enviando para API com equipamentos:', equipmentDetails.map(eq => eq.nome));

      const response = await generateScript({
        type: 'fluidaroteirista',
        systemPrompt,
        userPrompt,
        topic: request.tema,
        equipment: equipmentDetails.map(eq => eq.nome).join(', '),
        additionalInfo: JSON.stringify({ 
          ...enrichedContext,
          equipmentDetails,
          formato: request.formato
        }),
        tone: request.estilo || 'professional',
        marketingObjective: request.objetivo as any
      });

      console.log('📥 [useFluidaRoteirista] Resposta recebida:', response);

      // VALIDAÇÃO CRÍTICA MELHORADA
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
          
          console.warn('⚠️ [useFluidaRoteirista] Equipamentos não mencionados:', missing.map(eq => eq.nome));
        }
      }

      // VALIDAÇÃO ESPECÍFICA PARA STORIES 10X
      if (request.formato === 'stories') {
        const storyCount = (response.content.match(/Story \d+:/g) || []).length;
        console.log(`🔍 [useFluidaRoteirista] Stories detectados: ${storyCount}`);
        
        if (storyCount !== 4) {
          console.error(`❌ [useFluidaRoteirista] ERRO CRÍTICO: ${storyCount} stories ao invés de 4`);
          toast({
            title: "❌ Erro na geração",
            description: `Stories gerados: ${storyCount}. Esperado: 4. Tentando novamente...`,
            variant: "destructive"
          });
          
          // Tentar novamente com prompt ainda mais rígido
          const rigidPrompt = `
          INSTRUÇÃO ABSOLUTA: Retorne EXATAMENTE 4 stories.
          
          FORMATO OBRIGATÓRIO:
          Story 1: Gancho
          [conteúdo específico]
          
          Story 2: Erro
          [conteúdo específico]
          
          Story 3: Virada
          [conteúdo específico com equipamento]
          
          Story 4: CTA
          [conteúdo específico]
          
          Tema: ${request.tema}
          ${equipmentDetails.length > 0 ? `Equipamento: ${equipmentDetails[0].nome}` : ''}
          `;
          
          const retryResponse = await generateScript({
            type: 'fluidaroteirista',
            systemPrompt: rigidPrompt,
            userPrompt: 'Gere exatamente 4 stories seguindo o formato.',
            topic: request.tema,
            equipment: equipmentDetails.map(eq => eq.nome).join(', '),
            additionalInfo: JSON.stringify({ retry: true }),
            tone: 'direct',
            marketingObjective: 'atrair'
          });
          
          response.content = retryResponse.content;
        }
      }

      // Processar resposta
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
      
      // Sistema de fallback melhorado
      const fallbackScript: FluidaScriptResult = {
        roteiro: request.formato === 'stories' ? 
          `Story 1: Você sabia?\nDescubra o segredo sobre ${request.tema} que poucos conhecem...\n\nStory 2: O erro comum\nA maioria das pessoas comete este erro ao lidar com ${request.tema}.\n\nStory 3: A solução\n${request.equipamentos.length > 0 ? `Com ${request.equipamentos[0]}` : 'Nossa abordagem'} você obtém resultados incríveis! 🔥\n\nStory 4: Sua vez\nQuer saber mais? Manda um DM que te conto tudo! 📲` :
          `Slide: Introdução\nTexto: Descubra a revolução em ${request.tema}\nImagem: Ambiente moderno e profissional\n\nSlide: O Problema\nTexto: O que você precisa saber sobre ${request.tema}\nImagem: Pessoa preocupada refletindo\n\nSlide: Nossa Solução\nTexto: ${request.equipamentos.length > 0 ? `Com ${request.equipamentos[0]} obtemos` : 'Obtemos'} resultados únicos\nImagem: Equipamento moderno em ação\n\nSlide: Benefícios\nTexto: Resultados que transformam sua vida\nImagem: Pessoa satisfeita e confiante\n\nSlide: Call to Action\nTexto: Agende sua consulta agora!\nImagem: Profissional acolhedor recepcionando`,
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
