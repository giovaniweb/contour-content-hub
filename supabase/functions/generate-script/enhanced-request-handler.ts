
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { EquipmentFetcher } from "./equipment-fetcher.ts";

export class EnhancedRequestHandler {
  private openAIApiKey: string;
  private supabase: any;

  constructor(openAIApiKey: string) {
    this.openAIApiKey = openAIApiKey;
    this.supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );
  }

  async processFluidaRequest(request: any): Promise<{ systemPrompt: string; userPrompt: string; equipmentDetails: any[] }> {
    console.log('🎬 [EnhancedRequestHandler] Processando request FLUIDA:', request);
    
    // CORREÇÃO CRÍTICA: Buscar equipamentos usando método estático diretamente
    let equipmentDetails: any[] = [];
    try {
      if (request.equipment && request.equipment.trim()) {
        const equipmentNames = request.equipment.split(',').map((name: string) => name.trim()).filter(Boolean);
        console.log('🔧 [EnhancedRequestHandler] Equipamentos a buscar:', equipmentNames);
        
        equipmentDetails = await EquipmentFetcher.fetchEquipmentDetails(this.supabase, equipmentNames);
        console.log('✅ [EnhancedRequestHandler] Equipamentos encontrados:', equipmentDetails.length);
      } else {
        console.log('ℹ️ [EnhancedRequestHandler] Nenhum equipamento especificado');
      }
    } catch (equipmentError) {
      console.error('⚠️ [EnhancedRequestHandler] Erro ao buscar equipamentos (continuando):', equipmentError);
      // Continuar mesmo se a busca de equipamentos falhar
      equipmentDetails = [];
    }

    // CORREÇÃO CRÍTICA: Para Stories 10x, usar metodologia específica
    if (this.isStories10xRequest(request)) {
      console.log('🎯 [EnhancedRequestHandler] Detectado Stories 10x - usando metodologia Leandro Ladeira');
      return this.buildStories10xPrompt(request, equipmentDetails);
    }

    // Para outros formatos, usar sistema de técnicas
    console.log('🔍 [EnhancedRequestHandler] Construindo prompt com técnicas específicas');
    return this.buildTechniqueBasedPrompt(request, equipmentDetails);
  }

  private isStories10xRequest(request: any): boolean {
    return request.additionalInfo?.includes('stories_10x') ||
           request.systemPrompt?.includes('STORIES 10X') ||
           request.userPrompt?.includes('stories_10x');
  }

  private buildStories10xPrompt(request: any, equipmentDetails: any[]): { systemPrompt: string; userPrompt: string; equipmentDetails: any[] } {
    console.log('🎯 [EnhancedRequestHandler] Construindo prompt Stories 10x específico');

    const equipmentContext = equipmentDetails.length > 0 
      ? `\n🔧 EQUIPAMENTOS/TRATAMENTOS:
${equipmentDetails.map((eq, index) => `${index + 1}. ${eq.nome}: ${eq.tecnologia}
   - Benefícios: ${eq.beneficios}
   - Mencionar na Story 3 de forma natural`).join('\n')}`
      : '';

    const systemPrompt = `Você é especialista na metodologia STORIES 10X do Leandro Ladeira.

🎯 METODOLOGIA STORIES 10X - PRINCÍPIOS:
- Criado com Kátia Damasceno para aumentar engajamento
- Transformar Stories em comunidade ativa
- Sequência > Story solto: criar contexto e narrativa envolvente
- Usar storytelling emocional com final que convida a compartilhar
- Tom conversado, evitar excesso de "aulinha"
- Pelo menos 3 dispositivos de engajamento por sequência

📋 ESTRUTURA OBRIGATÓRIA (5 Stories):

Story 1 (GANCHO): 
- Gatilho da curiosidade ("Você já passou por isso aqui?")
- Enquete de identificação [Enquete: Sim / MUITO]
- Pergunta direta que gera identificação

Story 2 (CONTEXTO):
- História pessoal ou de cliente
- Tom conversado, vulnerável
- Criar conexão emocional

Story 3 (VIRADA):
- Descoberta transformadora
- Mudança de perspectiva
- Solução apresentada de forma natural${equipmentDetails.length > 0 ? ' (mencionar equipamentos aqui)' : ''}

Story 4 (CTA):
- Gatilho da reciprocidade ("Se isso te ajudou, manda para alguém")
- CTA de identificação específica
- Pedir ação social

Story 5 (BÔNUS):
- Efeito trailer ("Quer a parte 2? Me manda um 🔥")
- Promessa de continuação
- Gerar antecipação

${equipmentContext}

🎬 FORMATO DE SAÍDA - EXATAMENTE ASSIM:
Story 1: [Texto do gancho com dispositivo de engajamento]
Story 2: [Texto do contexto/história pessoal]  
Story 3: [Texto da virada/solução${equipmentDetails.length > 0 ? ' mencionando equipamentos' : ''}]
Story 4: [Texto do CTA social específico]
Story 5: [Texto do bônus/antecipação]

🚨 REGRAS CRÍTICAS:
- NÃO use JSON
- NÃO limite palavras rigidamente
- FOQUE na metodologia de criar comunidade
- Tom conversado, sem linguagem de professor
- Use emojis e humor leve quando apropriado`;

    const userPrompt = request.userPrompt || `Tema: ${request.topic}
Crie uma sequência Stories 10x seguindo EXATAMENTE a metodologia do Leandro Ladeira.

EXEMPLO DE REFERÊNCIA:
Story 1: "Você também trava quando liga a câmera? 😳 // [Enquete: Sim / MUITO]"
Story 2: "Eu travava tanto que uma vez apaguei um vídeo só porque gaguejei no início 😅"  
Story 3: "Mas aí eu descobri um truque simples que mudou tudo: FINGIR que tô explicando pra um amigo, não pra 'internet'"
Story 4: "Se isso te ajudou, manda esse Story praquele seu amigo(a) que vive falando 'eu não nasci pra câmera' 🎥❤️"
Story 5: "Quer a parte 2? Me manda um 🔥 que eu libero!"`;

    return { systemPrompt, userPrompt, equipmentDetails };
  }

  private buildTechniqueBasedPrompt(request: any, equipmentDetails: any[]): { systemPrompt: string; userPrompt: string; equipmentDetails: any[] } {
    // Para outros formatos, usar o prompt que já vem na requisição ou fallback
    const systemPrompt = request.systemPrompt || this.buildFallbackPrompt(request, equipmentDetails);
    const userPrompt = request.userPrompt || `Tema: ${request.topic}`;

    return { systemPrompt, userPrompt, equipmentDetails };
  }

  private buildFallbackPrompt(request: any, equipmentDetails: any[]): string {
    const equipmentContext = equipmentDetails.length > 0 
      ? `Equipamentos: ${equipmentDetails.map(eq => eq.nome).join(', ')}`
      : '';

    return `Você é um especialista em roteiros para redes sociais.
Crie um roteiro envolvente sobre: ${request.topic}
${equipmentContext}

Use tom ${request.tone || 'profissional'} e foque no objetivo: ${request.marketingObjective || 'engajar'}.`;
  }

  async callOpenAI(systemPrompt: string, userPrompt: string, equipmentDetails: any[]): Promise<string> {
    console.log('🤖 [EnhancedRequestHandler] Chamando OpenAI com equipamentos:', equipmentDetails.map(eq => eq.nome));
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-2024-11-20',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [EnhancedRequestHandler] Erro na API OpenAI:', errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    // Validar se equipamentos foram mencionados
    if (equipmentDetails.length > 0) {
      const mentionedEquipments = equipmentDetails.filter(eq => 
        content.toLowerCase().includes(eq.nome.toLowerCase())
      );
      
      if (mentionedEquipments.length === equipmentDetails.length) {
        console.log('✅ [EnhancedRequestHandler] Roteiro gerado com equipamentos mencionados');
      } else {
        console.warn('⚠️ [EnhancedRequestHandler] Alguns equipamentos não foram mencionados');
      }
    }

    return content;
  }
}
