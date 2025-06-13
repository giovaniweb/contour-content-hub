
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

    // Construir prompt aprimorado
    const enhancedSystemPrompt = this.buildEnhancedSystemPrompt(
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

  private buildEnhancedSystemPrompt(
    originalPrompt: string, 
    equipments: EquipmentData[], 
    request: any
  ): string {
    const equipmentSection = EquipmentFetcher.buildEquipmentPromptSection(equipments);
    
    // Inserir seção de equipamentos no prompt original
    const enhancedPrompt = originalPrompt.replace(
      '📋 EQUIPAMENTOS DISPONÍVEIS:',
      equipmentSection
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
