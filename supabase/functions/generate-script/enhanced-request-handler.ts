import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { MentorPromptGenerator } from "./mentor-prompt-generator.ts";

interface EquipmentDetail {
  id: string;
  nome: string;
  tecnologia: string;
  beneficios: string;
  indicacoes: string;
  diferenciais: string;
  linguagem: string;
}

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

  // Regras padrão
  private readonly DEFAULT_BANNED = [
    'do jeito ladeira',
    'ladeira copywarrior',
    'copywarrior'
  ];

  private sanitizeContent(content: string, opts?: { format?: string; maxStories?: number; bannedPhrases?: string[] }) {
    let sanitized = content || '';

    // Remover frases banidas (case-insensitive)
    const banned = (opts?.bannedPhrases || []).concat(this.DEFAULT_BANNED);
    for (const phrase of banned) {
      const rx = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      sanitized = sanitized.replace(rx, '').replace(/\s{2,}/g, ' ');
    }

    // Limitar Stories a N itens (heurística de seções)
    if ((opts?.format || '').toLowerCase() === 'stories' && opts?.maxStories) {
      sanitized = this.limitSections(sanitized, opts.maxStories);
    }

    return sanitized.trim();
  }

  private limitSections(text: string, max: number) {
    const lines = text.split('\n');
    const sections: string[][] = [];
    let current: string[] = [];

    const isSectionHeader = (l: string) => /^(story|storie|slides?|\d+\.|#)/i.test(l.trim());

    for (const l of lines) {
      if (isSectionHeader(l) && current.length) {
        sections.push(current);
        current = [];
      }
      current.push(l);
    }
    if (current.length) sections.push(current);

    const limited = sections.slice(0, max).flat().join('\n');
    return limited || text;
  }
  /**
   * Fetch equipment details from database - updated to handle multiple equipment names
   */
  private async fetchEquipmentDetails(equipmentInput?: string | string[]): Promise<EquipmentDetail[]> {
    // Converter para array se for string
    const equipmentNames = Array.isArray(equipmentInput) 
      ? equipmentInput 
      : (equipmentInput ? [equipmentInput] : []);

    if (equipmentNames.length === 0) {
      console.log("⚠️ [EnhancedRequestHandler] Nenhum equipamento especificado");
      return [];
    }

    try {
      console.log("🔍 [EnhancedRequestHandler] Buscando equipamentos:", equipmentNames);
      
      let allEquipments: EquipmentDetail[] = [];
      
      for (const equipmentName of equipmentNames) {
        if (!equipmentName || equipmentName.trim() === '') {
          continue;
        }

        const cleanName = equipmentName.trim();
        console.log(`🔍 [EnhancedRequestHandler] Processando: "${cleanName}"`);
        
        // Busca mais flexível - tentar diferentes variações
        const searchTerms = [
          cleanName,
          cleanName.toLowerCase(),
          cleanName.toUpperCase(),
          cleanName.replace(/\s+/g, ''), // sem espaços
          cleanName.split(' ')[0], // primeira palavra
          // Para "Unyque PRO", buscar também variações
          cleanName.replace(/\s+(pro|plus|max|ultra)/gi, ''),
        ];
        
        let found = false;
        
        // Tentar diferentes formas de busca
        for (const term of searchTerms) {
          if (!term || term.length < 2) continue;
          
          console.log(`🔍 [EnhancedRequestHandler] Buscando com termo: "${term}"`);
          
          const result = await this.supabase
            .from('equipamentos')
            .select('*')
            .or(`nome.ilike.%${term}%,tecnologia.ilike.%${term}%`)
            .eq('ativo', true)
            .limit(5);
            
          if (result.data && result.data.length > 0) {
            console.log(`✅ [EnhancedRequestHandler] Equipamento encontrado com termo: "${term}" (${result.data.length} resultados)`);
            
            for (const eq of result.data) {
              // Evitar duplicatas
              if (!allEquipments.find(existing => existing.id === eq.id)) {
                const equipmentDetail: EquipmentDetail = {
                  id: eq.id,
                  nome: eq.nome,
                  tecnologia: eq.tecnologia || 'Tecnologia não especificada',
                  beneficios: eq.beneficios || 'Benefícios não especificados',
                  indicacoes: eq.indicacoes || 'Indicações não especificadas',
                  diferenciais: eq.diferenciais || 'Diferenciais não especificados',
                  linguagem: eq.linguagem || 'Português'
                };
                
                allEquipments.push(equipmentDetail);
                console.log(`📋 [EnhancedRequestHandler] Adicionado: ${eq.nome} | ${eq.tecnologia}`);
              }
            }
            found = true;
            break; // Se encontrou com este termo, não precisa testar outros
          }
        }
        
        if (!found) {
          console.warn(`⚠️ [EnhancedRequestHandler] Equipamento não encontrado: "${cleanName}"`);
        }
      }

      if (allEquipments.length === 0) {
        console.warn("⚠️ [EnhancedRequestHandler] NENHUM equipamento encontrado para:", equipmentNames);
        
        // Log adicional para debug - mostrar equipamentos disponíveis
        const { data: availableEquipments } = await this.supabase
          .from('equipamentos')
          .select('nome')
          .eq('ativo', true)
          .limit(10);
        
        console.log('📋 [EnhancedRequestHandler] Equipamentos disponíveis (amostra):', 
          availableEquipments?.map(eq => eq.nome) || 'Nenhum');
        
        return [];
      }

      console.log(`✅ [EnhancedRequestHandler] TOTAL: ${allEquipments.length} equipamento(s) encontrado(s)`);
      allEquipments.forEach(eq => {
        console.log(`📋 [EnhancedRequestHandler] ${eq.nome} | Tecnologia: ${eq.tecnologia}`);
      });
      
      return allEquipments;

    } catch (err) {
      console.error('❌ [EnhancedRequestHandler] Erro na busca de equipamentos:', err);
      return [];
    }
  }

  /**
   * Generate mentor-based creative prompts with real equipment data
   */
  private generateMentorPrompts(request: any, equipmentDetails: EquipmentDetail[], scientificContext: string = '') {
    console.log("🎭 Gerando prompts baseados no mentor:", request.mentor || 'Hyeser Souza');
    
    const mentorName = request.mentor || 'Hyeser Souza';
    const topic = request.topic || request.content || 'Tratamento estético';
    const equipmentName = request.equipment || 'equipamento estético';
    const format = request.format || 'reels';
    
    // Construir informações detalhadas do equipamento
    let equipmentInfo = '';
    if (equipmentDetails.length > 0) {
      const equipment = equipmentDetails[0];
      equipmentInfo = `
INFORMAÇÕES ESPECÍFICAS DO ${equipment.nome.toUpperCase()}:
- Nome: ${equipment.nome}
- Tecnologia: ${equipment.tecnologia}
- Benefícios: ${equipment.beneficios}
- Indicações: ${equipment.indicacoes}
- Diferenciais: ${equipment.diferenciais}
`;
    } else {
      console.warn("⚠️ Nenhum equipamento encontrado, usando informações genéricas");
      equipmentInfo = `
ATENÇÃO: Equipamento "${equipmentName}" não encontrado na base de dados.
Use apenas informações gerais sobre tratamentos estéticos, sem inventar especificações técnicas.
`;
    }
    
    // Gerar prompts personalizados baseados no mentor
    const { systemPrompt, userPrompt } = MentorPromptGenerator.generateMentorPrompt(
      mentorName,
      topic,
      equipmentName,
      scientificContext + '\n' + equipmentInfo,
      format
    );
    
    console.log("✅ Prompts criativos gerados para", mentorName);
    console.log("📋 Equipamento processado:", equipmentDetails.length > 0 ? equipmentDetails[0].nome : 'Genérico');
    
    return { systemPrompt, userPrompt };
  }

  /**
   * Process Fluida request with mentor-based creativity and equipment integration
   */
  async processFluidaRequest(request: any) {
    console.log("🎬 [EnhancedRequestHandler] Iniciando processamento FLUIDA");
    console.log("📋 [EnhancedRequestHandler] Dados da requisição:", JSON.stringify({
      topic: request.topic,
      equipment: request.equipment,
      equipmentNames: request.equipmentNames,
      mentor: request.mentor,
      format: request.format
    }, null, 2));
    
    // Usar a lista completa de equipamentos se disponível, senão usar o campo equipment
    const equipmentToSearch = request.equipmentNames && request.equipmentNames.length > 0 
      ? request.equipmentNames 
      : (request.equipment ? [request.equipment] : []);
    
    console.log("🔍 [EnhancedRequestHandler] Equipamentos para busca:", equipmentToSearch);

    // Fetch equipment details usando a nova implementação
    const equipmentDetails = await this.fetchEquipmentDetails(equipmentToSearch);
    
    console.log(`📋 [EnhancedRequestHandler] Equipamentos encontrados: ${equipmentDetails.length}`);
    equipmentDetails.forEach(eq => {
      console.log(`✅ [EnhancedRequestHandler] ${eq.nome}: ${eq.tecnologia}`);
    });
    
    // Build scientific context from request
    const scientificContext = request.scientificContext || '';
    console.log("🧬 [EnhancedRequestHandler] Contexto científico:", scientificContext ? `${scientificContext.length} caracteres` : 'Não fornecido');
    
    // Generate mentor-based creative prompts
    const { systemPrompt, userPrompt } = this.generateMentorPrompts(request, equipmentDetails, scientificContext);
    
    return { systemPrompt, userPrompt, equipmentDetails };
  }

  /**
   * Call OpenAI API with mentor-enhanced prompts + guardrails, routing e métricas
   */
  async callOpenAI(
    systemPrompt: string,
    userPrompt: string,
    _equipmentDetails: EquipmentDetail[],
    opts?: { format?: string; maxStories?: number; bannedPhrases?: string[]; userId?: string }
  ) {
    console.log("🤖 Chamando OpenAI com prompts do mentor...");

    const guardrails: string[] = [
      "NUNCA use as expressões: 'do jeito Ladeira', 'Ladeira CopyWarrior', 'CopyWarrior'.",
      "Mantenha linguagem profissional e clara; evite gírias e jargões desnecessários.",
    ];

    if ((opts?.format || '').toLowerCase() === 'stories') {
      const n = opts?.maxStories ?? 5;
      guardrails.push(
        `Se for Stories, gere no MÁXIMO ${n} stories, numerados de 1 a ${n}, cada um com 10-15s. Não ultrapasse ${n}.`
      );
    }

    const modelPrimary = 'gpt-4.1-2025-04-14';
    const modelFallback = 'gpt-4.1-mini-2025-04-14';

    const buildBody = (model: string) => ({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'system', content: `REGRAS E LIMITES:\n- ${guardrails.join('\n- ')}` },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 2000,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    const doRequest = async (model: string) => {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buildBody(model)),
      });
      return { res, model } as const;
    };

    let attempt = await doRequest(modelPrimary);

    if (!attempt.res.ok) {
      const text = await attempt.res.text();
      console.warn(`⚠️ Falha no modelo primário (${attempt.model}):`, attempt.res.status, text);
      console.log('🔁 Tentando fallback:', modelFallback);
      attempt = await doRequest(modelFallback);
      if (!attempt.res.ok) {
        const text2 = await attempt.res.text();
        console.error('❌ Erro da OpenAI (fallback):', attempt.res.status, text2);
        throw new Error(`OpenAI API error: ${attempt.res.status} - ${text2}`);
      }
    }

    const data = await attempt.res.json();

    if (!data.choices?.[0]?.message?.content) {
      console.error('❌ Resposta inválida da OpenAI:', data);
      throw new Error('Invalid OpenAI response structure');
    }

    const rawContent = data.choices[0].message.content as string;
    const content = this.sanitizeContent(rawContent, {
      format: opts?.format,
      maxStories: opts?.maxStories ?? 5,
      bannedPhrases: opts?.bannedPhrases,
    });

    // Logs breves
    console.log('✅ Conteúdo gerado');
    console.log('📝 Preview:', content.split('\n')[0]);

    // Métricas básicas de uso
    try {
      const usage = data.usage || {};
      const promptTokens = usage.prompt_tokens || 0;
      const completionTokens = usage.completion_tokens || 0;
      const totalTokens = usage.total_tokens || (promptTokens + completionTokens);

      // Estimativa (aprox) para gpt-4.1
      const inputCost = (promptTokens / 1000) * 0.0025;
      const outputCost = (completionTokens / 1000) * 0.01;
      const estimatedCost = inputCost + outputCost;

      await this.supabase.from('ai_usage_metrics').insert([
        {
          service_name: 'openai-chat',
          endpoint: 'generate-script',
          model: attempt.model,
          prompt_tokens: promptTokens,
          completion_tokens: completionTokens,
          total_tokens: totalTokens,
          estimated_cost: estimatedCost,
          response_time_ms: null,
          user_id: opts?.userId || null,
        },
      ]);
    } catch (mErr) {
      console.warn('⚠️ Falha ao gravar métricas de uso:', mErr);
    }

    return content;
  }
}