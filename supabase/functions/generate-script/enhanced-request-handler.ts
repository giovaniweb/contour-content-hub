import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { EquipmentFetcher, EquipmentData } from './equipment-fetcher.ts';

export class EnhancedRequestHandler {
  private supabase: any;
  private openAIApiKey: string;

  constructor(openAIApiKey: string) {
    this.openAIApiKey = openAIApiKey;
    this.supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );
  }

  async processFluidaRequest(request: any) {
    console.log('🎬 [EnhancedRequestHandler] Processando request FLUIDA:', request);

    // Extrair equipamentos do request
    let equipmentNames: string[] = [];
    
    if (request.equipment) {
      if (Array.isArray(request.equipment)) {
        equipmentNames = request.equipment;
      } else if (typeof request.equipment === 'string') {
        equipmentNames = [request.equipment];
      }
    }

    // Buscar dados detalhados dos equipamentos
    const equipmentDetails = await EquipmentFetcher.fetchEquipmentDetails(
      this.supabase, 
      equipmentNames
    );

    console.log('🔧 [EnhancedRequestHandler] Equipamentos detalhados:', equipmentDetails.length);

    // CORREÇÃO CRÍTICA: Construir prompt usando sistema de técnicas
    const enhancedSystemPrompt = await this.buildTechniqueAwareSystemPrompt(
      request.systemPrompt || '', 
      equipmentDetails,
      request
    );

    const enhancedUserPrompt = this.buildEnhancedUserPrompt(
      request.userPrompt || '',
      equipmentDetails,
      request
    );

    return {
      systemPrompt: enhancedSystemPrompt,
      userPrompt: enhancedUserPrompt,
      equipmentDetails
    };
  }

  private async buildTechniqueAwareSystemPrompt(
    originalPrompt: string, 
    equipments: EquipmentData[], 
    request: any
  ): Promise<string> {
    console.log('🔍 [EnhancedRequestHandler] Construindo prompt com técnicas específicas');
    
    // Extrair informações do prompt original para identificar mentor e formato
    const mentorMatch = originalPrompt.match(/MENTOR: (\w+)/);
    const formatoMatch = originalPrompt.match(/Formato: (\w+)/);
    
    if (!mentorMatch || !formatoMatch) {
      console.warn('⚠️ [EnhancedRequestHandler] Não foi possível extrair mentor/formato, usando prompt original');
      return this.buildEnhancedSystemPromptFallback(originalPrompt, equipments, request);
    }
    
    const mentorKey = mentorMatch[1];
    const formato = formatoMatch[1];
    
    // Converter mentor key para nome real
    const mentorNomeReal = this.convertMentorKeyToRealName(mentorKey);
    console.log(`🎯 [EnhancedRequestHandler] Buscando técnicas para: ${mentorNomeReal}, formato: ${formato}`);
    
    try {
      // Buscar técnicas do mentor
      const { data, error } = await this.supabase
        .from('mentores')
        .select('tecnicas')
        .eq('nome', mentorNomeReal)
        .single();

      if (error || !data?.tecnicas) {
        console.warn(`⚠️ [EnhancedRequestHandler] Não encontrou técnicas para ${mentorNomeReal}, usando fallback`);
        return this.buildEnhancedSystemPromptFallback(originalPrompt, equipments, request);
      }

      const tecnicas = Array.isArray(data.tecnicas) ? data.tecnicas : [];
      console.log(`📋 [EnhancedRequestHandler] Técnicas encontradas: ${tecnicas.length}`);
      
      // Selecionar melhor técnica
      const tecnicaCompativel = this.selectBestTechnique(tecnicas, formato, request.marketingObjective || 'atrair');
      
      if (tecnicaCompativel) {
        console.log(`✨ [EnhancedRequestHandler] Usando técnica: ${tecnicaCompativel.nome}`);
        return this.buildSpecificTechniquePrompt(tecnicaCompativel, equipments, request);
      }
      
    } catch (error) {
      console.error('❌ [EnhancedRequestHandler] Erro ao buscar técnicas:', error);
    }
    
    // Fallback para prompt genérico
    return this.buildEnhancedSystemPromptFallback(originalPrompt, equipments, request);
  }

  private convertMentorKeyToRealName(mentorKey: string): string {
    const mentorMapping: Record<string, string> = {
      'leandro_ladeira': 'Leandro Ladeira',
      'paulo_cuenca': 'Paulo Cuenca',
      'pedro_sobral': 'Pedro Sobral',
      'icaro_carvalho': 'Ícaro de Carvalho',
      'camila_porto': 'Camila Porto',
      'hyeser_souza': 'Hyeser Souza',
      'washington_olivetto': 'Washington Olivetto'
    };
    
    return mentorMapping[mentorKey] || mentorKey;
  }

  private selectBestTechnique(tecnicas: any[], formato: string, objetivo: string): any | null {
    if (!tecnicas || tecnicas.length === 0) {
      return null;
    }

    // Filtrar técnicas compatíveis com o formato
    const compatibleTechniques = tecnicas.filter(tecnica =>
      tecnica.condicoes_ativacao?.formatos?.includes(formato) ||
      tecnica.condicoes_ativacao?.formatos?.includes(formato.replace('_', ''))
    );

    if (compatibleTechniques.length === 0) {
      return null;
    }

    // Priorizar por objetivo se especificado
    const objectiveMatch = compatibleTechniques.filter(tecnica =>
      tecnica.condicoes_ativacao?.objetivos?.includes(objetivo)
    );

    const candidates = objectiveMatch.length > 0 ? objectiveMatch : compatibleTechniques;

    // Ordenar por prioridade (maior primeiro)
    candidates.sort((a, b) => 
      (b.condicoes_ativacao?.prioridade || 0) - (a.condicoes_ativacao?.prioridade || 0)
    );

    return candidates[0];
  }

  private buildSpecificTechniquePrompt(tecnica: any, equipments: EquipmentData[], request: any): string {
    const equipmentSection = EquipmentFetcher.buildEquipmentPromptSection(equipments);
    
    let promptTecnica = tecnica.prompt;
    
    // Substituir placeholders
    if (promptTecnica.includes('[TEMA_INSERIDO]')) {
      promptTecnica = promptTecnica.replace('[TEMA_INSERIDO]', request.topic || 'o tema será fornecido');
    }

    return `🎯 TÉCNICA ESPECÍFICA ATIVADA: ${tecnica.nome}

${promptTecnica}

${equipmentSection}

IMPORTANTE: Use EXCLUSIVAMENTE a técnica específica acima. Siga rigorosamente a metodologia da técnica.`;
  }

  private buildEnhancedSystemPromptFallback(
    originalPrompt: string, 
    equipments: EquipmentData[], 
    request: any
  ): string {
    const equipmentSection = EquipmentFetcher.buildEquipmentPromptSection(equipments);
    
    // Inserir seção de equipamentos no prompt original
    const enhancedPrompt = originalPrompt.replace(
      'Nenhum equipamento específico foi selecionado. Use termos genéricos.',
      equipmentSection || 'Nenhum equipamento específico foi selecionado. Use termos genéricos.'
    );

    return enhancedPrompt;
  }

  private buildEnhancedUserPrompt(
    originalPrompt: string,
    equipments: EquipmentData[],
    request: any
  ): string {
    if (equipments.length === 0) {
      return originalPrompt;
    }

    const equipmentEmphasis = `
🚨 EQUIPAMENTOS OBRIGATÓRIOS (MENCIONE TODOS):
${equipments.map((eq, index) => `${index + 1}. ${eq.nome}: ${eq.tecnologia}
   - Benefícios: ${eq.beneficios}
   - Diferenciais: ${eq.diferenciais}`).join('\n')}

🔥 REGRA CRÍTICA: O roteiro DEVE mencionar ESPECIFICAMENTE cada um destes equipamentos pelo nome.
⚠️ Se você não mencionar os equipamentos listados, o roteiro será rejeitado.

    `;

    return originalPrompt.replace(
      'INSTRUÇÕES ESPECÍFICAS:',
      `${equipmentEmphasis}\nINSTRUÇÕES ESPECÍFICAS:`
    );
  }

  async callOpenAI(systemPrompt: string, userPrompt: string, equipments: EquipmentData[]) {
    console.log('🤖 [EnhancedRequestHandler] Chamando OpenAI com equipamentos:', equipments.map(eq => eq.nome));

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1500,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Validar se equipamentos foram mencionados
    if (equipments.length > 0) {
      const missingEquipments = equipments.filter(eq => 
        !content.toLowerCase().includes(eq.nome.toLowerCase())
      );

      if (missingEquipments.length > 0) {
        console.error('❌ [EnhancedRequestHandler] Equipamentos não mencionados:', missingEquipments.map(eq => eq.nome));
        
        // Tentar uma segunda vez com prompt ainda mais enfático
        return await this.retryWithStrongerPrompt(systemPrompt, userPrompt, equipments, missingEquipments);
      }
    }

    console.log('✅ [EnhancedRequestHandler] Roteiro gerado com equipamentos mencionados');
    return content;
  }

  private async retryWithStrongerPrompt(
    systemPrompt: string, 
    userPrompt: string, 
    equipments: EquipmentData[], 
    missingEquipments: EquipmentData[]
  ) {
    console.log('🔄 [EnhancedRequestHandler] Tentativa 2 com prompt mais forte');

    const strongerPrompt = `
${userPrompt}

🚨🚨🚨 ATENÇÃO CRÍTICA 🚨🚨🚨
VOCÊ ESQUECEU DE MENCIONAR ESTES EQUIPAMENTOS:
${missingEquipments.map(eq => `- ${eq.nome}`).join('\n')}

O ROTEIRO SERÁ REJEITADO se não mencionar TODOS os equipamentos.
REESCREVA incluindo OBRIGATORIAMENTE: ${missingEquipments.map(eq => eq.nome).join(', ')}
    `;

    const retryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: strongerPrompt }
        ],
        max_tokens: 1500,
        temperature: 0.3 // Menor temperatura para maior precisão
      }),
    });

    const retryData = await retryResponse.json();
    return retryData.choices[0].message.content;
  }
}
