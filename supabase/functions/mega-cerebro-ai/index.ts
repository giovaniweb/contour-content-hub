import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Intent Router - detecção inteligente de intenções
class IntentRouter {
  static detectIntent(message: string): { type: string, confidence: number, keywords: string[] } {
    const lowercaseMessage = message.toLowerCase();
    
    const intentPatterns = {
      script_generation: [
        /roteiro|script|conteúdo|post|instagram|stories|criar.*post/i,
        /gerar.*texto|escrever.*legenda|caption|marketing/i
      ],
      learning: [
        /aprender|ensinar|explicar|como.*fazer|curso|protocolo/i,
        /me.*ensine|quero.*saber|técnica|procedimento/i
      ],
      equipment_consultation: [
        /equipamento|aparelho|máquina|qual.*melhor|indicação/i,
        /comparar.*equipamento|tecnologia|radiofrequência|laser/i
      ],
      video_search: [
        /vídeo|assistir|ver.*demonstração|mostrar|tutorial/i,
        /exemplo.*prático|passo.*passo|visualizar/i
      ],
      academy_question: [
        /academy|academia|certificação|curso.*academy|lição/i,
        /progresso|completar.*curso|certificado/i
      ],
      scientific_research: [
        /estudo|pesquisa|artigo.*científico|evidência|paper/i,
        /bibliografia|research|publicação/i
      ],
      performance_analysis: [
        /performance|resultado|métricas|analytics|dados/i,
        /relatório|análise|conversão|engajamento/i
      ]
    };

    let maxScore = 0;
    let detectedIntent = 'general_consultation';
    let keywords: string[] = [];

    Object.entries(intentPatterns).forEach(([intent, patterns]) => {
      let score = 0;
      patterns.forEach(pattern => {
        if (pattern.test(message)) score += 2;
      });
      
      if (score > maxScore) {
        maxScore = score;
        detectedIntent = intent;
        keywords = message.split(/\s+/).filter(word => word.length > 3).slice(0, 5);
      }
    });

    return {
      type: detectedIntent,
      confidence: Math.min(maxScore / 4, 1),
      keywords
    };
  }
}

// Módulos especializados
class SpecializedModules {
  static async scriptGeneration(supabase: any, userMessage: string, context: any) {
    console.log('🎬 Módulo Roteirista IA ativado');
    
    // Buscar roteiros aprovados como referência
    const { data: approvedScripts } = await supabase
      .from('approved_scripts')
      .select('title, script_content, equipment_used')
      .eq('approval_status', 'approved')
      .limit(5);

    // Buscar equipamentos relevantes
    const { data: equipments } = await supabase
      .from('equipamentos')
      .select('nome, categoria, indicacoes, beneficios')
      .eq('ativo', true)
      .limit(10);

    const knowledgeBase = {
      approvedScripts: approvedScripts || [],
      equipments: equipments || []
    };

    return {
      systemPrompt: `🎬 ROTEIRISTA IA ESPECIALIZADO

Você cria roteiros profissionais para estética baseados em:
- Biblioteca de roteiros aprovados
- Equipamentos disponíveis
- Melhores práticas de marketing

ESTRUTURA DO ROTEIRO:
1. GANCHO (primeira frase impactante)
2. DESENVOLVIMENTO (problema + solução)
3. CTA (chamada para ação clara)

CONHECIMENTO DISPONÍVEL:
Roteiros Aprovados: ${knowledgeBase.approvedScripts.length}
Equipamentos: ${knowledgeBase.equipments.length}

FORMATO DE RESPOSTA:
- Roteiro estruturado
- Sugestões visuais
- Hashtags relevantes
- Dicas de performance`,
      
      knowledgeContext: `
📚 ROTEIROS DE REFERÊNCIA:
${knowledgeBase.approvedScripts.map((script: any) => `
• ${script.title}
  Equipamentos: ${Array.isArray(script.equipment_used) ? script.equipment_used.join(', ') : script.equipment_used}
  Trecho: ${script.script_content?.substring(0, 200)}...
`).join('\n')}

🔧 EQUIPAMENTOS DISPONÍVEIS:
${knowledgeBase.equipments.map((eq: any) => `
• ${eq.nome} (${eq.categoria})
  Indicações: ${eq.indicacoes}
  Benefícios: ${eq.beneficios}
`).join('\n')}`,
      
      metadata: { scriptsGenerated: 1, equipmentUsed: knowledgeBase.equipments.length }
    };
  }

  static async learning(supabase: any, userMessage: string, context: any) {
    console.log('👩‍🏫 Módulo Professor Virtual ativado');
    
    // Buscar cursos da Academy
    const { data: courses } = await supabase
      .from('academy_courses')
      .select('title, description, equipment_name, estimated_duration_hours')
      .eq('status', 'active')
      .limit(8);

    // Buscar lições relevantes
    const { data: lessons } = await supabase
      .from('academy_lessons')
      .select('title, description, duration_minutes')
      .limit(10);

    return {
      systemPrompt: `👩‍🏫 PROFESSOR VIRTUAL DE ESTÉTICA

Você ensina técnicas e protocolos baseados em:
- Cursos estruturados da Academy
- Lições práticas detalhadas
- Conhecimento científico atualizado

ESPECIALIDADES:
- Protocolos passo a passo
- Recomendação de cursos
- Sequência de aprendizado
- Aplicação prática

FORMATO DE RESPOSTA:
- Explicação didática
- Protocolo estruturado
- Cursos recomendados
- Próximos passos`,
      
      knowledgeContext: `
🎓 CURSOS DISPONÍVEIS:
${(courses || []).map((course: any) => `
• ${course.title}
  Equipamento: ${course.equipment_name}
  Duração: ${course.estimated_duration_hours}h
  Descrição: ${course.description}
`).join('\n')}

📚 LIÇÕES PRÁTICAS:
${(lessons || []).map((lesson: any) => `
• ${lesson.title} (${lesson.duration_minutes}min)
  ${lesson.description}
`).join('\n')}`,
      
      metadata: { coursesRecommended: courses?.length || 0 }
    };
  }

  static async equipmentConsultation(supabase: any, userMessage: string, context: any) {
    console.log('🔍 Módulo Consultor de Equipamentos ativado');
    
    // Buscar equipamentos com detalhes completos
    const { data: equipments } = await supabase
      .from('equipamentos')
      .select(`
        nome, categoria, tecnologia, indicacoes, beneficios, 
        contraindicacoes, nivel_investimento, perfil_ideal_paciente
      `)
      .eq('ativo', true)
      .eq('akinator_enabled', true);

    return {
      systemPrompt: `🔍 CONSULTOR DE EQUIPAMENTOS ESPECIALIZADO

Você analisa e recomenda equipamentos baseado em:
- Especificações técnicas completas
- Indicações e contraindicações
- ROI e viabilidade comercial
- Perfil ideal do paciente

ANÁLISE INCLUI:
- Comparativo técnico
- Viabilidade financeira
- Protocolos específicos
- Resultados esperados

FORMATO DE RESPOSTA:
- Recomendação específica
- Justificativa técnica
- Comparativo de benefícios
- Protocolo sugerido`,
      
      knowledgeContext: `
🔧 BASE COMPLETA DE EQUIPAMENTOS:
${(equipments || []).map((eq: any) => `
• ${eq.nome} - ${eq.categoria}
  Tecnologia: ${eq.tecnologia}
  Indicações: ${eq.indicacoes}
  Benefícios: ${eq.beneficios}
  Contraindicações: ${eq.contraindicacoes}
  Investimento: ${eq.nivel_investimento}
  Perfil ideal: ${Array.isArray(eq.perfil_ideal_paciente) ? eq.perfil_ideal_paciente.join(', ') : eq.perfil_ideal_paciente}
`).join('\n')}`,
      
      metadata: { equipmentUsed: equipments?.length || 0 }
    };
  }

  static async videoSearch(supabase: any, userMessage: string, context: any) {
    console.log('📹 Módulo Curador de Vídeos ativado');
    
    // Buscar vídeos relevantes
    const { data: videos } = await supabase
      .from('videos')
      .select(`
        titulo, descricao, categoria, equipamento, tags, 
        url_video, thumbnail_url, duracao
      `)
      .eq('ativo', true)
      .limit(10);

    return {
      systemPrompt: `📹 CURADOR DE VÍDEOS ESPECIALIZADO

Você encontra e recomenda vídeos da biblioteca baseado em:
- Catálogo completo de 157+ vídeos
- Categorização por técnica/equipamento
- Sequência otimizada de aprendizado
- Casos práticos demonstrativos

TIPOS DE CONTEÚDO:
- Tutoriais técnicos
- Demonstrações práticas
- Cases de sucesso
- Protocolos detalhados

FORMATO DE RESPOSTA:
- Lista de vídeos específicos
- Contexto e descrição
- Ordem de visualização
- Pontos-chave importantes`,
      
      knowledgeContext: `
📹 BIBLIOTECA DE VÍDEOS:
${(videos || []).map((video: any) => `
• ${video.titulo} (${video.duracao})
  Categoria: ${video.categoria}
  Equipamento: ${video.equipamento}
  Tags: ${Array.isArray(video.tags) ? video.tags.join(', ') : video.tags}
  Descrição: ${video.descricao}
`).join('\n')}`,
      
      metadata: { videosFound: videos?.length || 0 }
    };
  }

  static async scientificResearch(supabase: any, userMessage: string, context: any) {
    console.log('🔬 Módulo Pesquisador Científico ativado');
    
    // Buscar artigos científicos
    const { data: articles } = await supabase
      .from('unified_documents')
      .select('titulo_extraido, texto_completo, palavras_chave, autores')
      .eq('tipo_documento', 'artigo_cientifico')
      .eq('status_processamento', 'concluido')
      .limit(8);

    return {
      systemPrompt: `🔬 PESQUISADOR CIENTÍFICO ESPECIALIZADO

Você acessa e interpreta estudos científicos:
- Base de artigos científicos validados
- Evidências atualizadas
- Interpretação prática
- Recomendações baseadas em dados

ANÁLISE CIENTÍFICA:
- Evidências robustas
- Metodologia validada
- Aplicação clínica
- Segurança e eficácia

FORMATO DE RESPOSTA:
- Evidências científicas
- Estudos específicos citados
- Interpretação para prática
- Bibliografia relevante`,
      
      knowledgeContext: `
📖 ARTIGOS CIENTÍFICOS:
${(articles || []).map((article: any) => `
• "${article.titulo_extraido}"
  Autores: ${Array.isArray(article.autores) ? article.autores.join(', ') : article.autores}
  Keywords: ${Array.isArray(article.palavras_chave) ? article.palavras_chave.join(', ') : article.palavras_chave}
  Resumo: ${article.texto_completo?.substring(0, 300)}...
`).join('\n')}`,
      
      metadata: { articlesConsulted: articles?.length || 0 }
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY não encontrada');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const requestData = await req.json();
    const { messages, userProfile, modelTier = 'standard' } = requestData;
    
    const lastMessage = messages[messages.length - 1]?.content || '';
    
    console.log('🧠 MEGA CÉREBRO iniciado:', {
      messagesCount: messages?.length || 0,
      userProfile: userProfile || 'detectando...',
      modelTier
    });

    // 1. DETECTAR INTENÇÃO
    const intent = IntentRouter.detectIntent(lastMessage);
    console.log('🎯 Intenção detectada:', intent);

    // 2. ATIVAR MÓDULO ESPECIALIZADO
    let moduleResponse = null;
    
    switch (intent.type) {
      case 'script_generation':
        moduleResponse = await SpecializedModules.scriptGeneration(supabase, lastMessage, { userProfile });
        break;
      case 'learning':
        moduleResponse = await SpecializedModules.learning(supabase, lastMessage, { userProfile });
        break;
      case 'equipment_consultation':
        moduleResponse = await SpecializedModules.equipmentConsultation(supabase, lastMessage, { userProfile });
        break;
      case 'video_search':
        moduleResponse = await SpecializedModules.videoSearch(supabase, lastMessage, { userProfile });
        break;
      case 'scientific_research':
        moduleResponse = await SpecializedModules.scientificResearch(supabase, lastMessage, { userProfile });
        break;
      default:
        // Módulo geral - usar sistema original melhorado
        moduleResponse = {
          systemPrompt: `🔮 MEGA CÉREBRO - CONSULTOR GERAL

Você é uma IA especializada que integra TODOS os módulos:
🎬 Roteirista IA | 👩‍🏫 Professor Virtual | 🔍 Consultor de Equipamentos
📹 Curador de Vídeos | 🔬 Pesquisador Científico

CAPACIDADES INTEGRADAS:
- Diagnóstico completo de necessidades
- Recomendações personalizadas multi-módulo
- Acesso a toda base de conhecimento
- Visão holística e estratégica

FORMATO DE RESPOSTA:
- Análise situacional
- Recomendações específicas
- Próximos passos claros
- Recursos disponíveis`,
          knowledgeContext: `Base completa disponível para consulta integrada.`,
          metadata: { equipmentUsed: 0, articlesConsulted: 0 }
        };
    }

    // 3. CONSTRUIR CONTEXTO COMPLETO
    const contextualMessages = [
      {
        role: "system",
        content: `${moduleResponse.systemPrompt}

🎯 INTENÇÃO DETECTADA: ${intent.type} (${(intent.confidence * 100).toFixed(0)}% confiança)
📋 PALAVRAS-CHAVE: ${intent.keywords.join(', ')}

${moduleResponse.knowledgeContext}

🔮 INSTRUÇÕES ESPECIAIS:
- Seja específico e prático
- Use formatação clara com bullets (•) e **negrito**
- Máximo 150 palavras por resposta
- Inclua sugestões de próximos passos
- Mantenha tom místico mas científico

IMPORTANTE: Use APENAS as informações fornecidas na base de conhecimento.`
      },
      ...messages
    ];

    // 4. CHAMAR OPENAI
    const usedModel = modelTier === 'gpt5' ? 'gpt-4o' : 'gpt-4o-mini';
    const startTime = Date.now();
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: usedModel,
        messages: contextualMessages,
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(`Erro na API OpenAI: ${data.error.message}`);
    }

    const assistantReply = data.choices?.[0]?.message?.content ?? '';
    const responseTime = Date.now() - startTime;

    // 5. REGISTRAR MÉTRICAS
    try {
      const promptTokens = data.usage?.prompt_tokens ?? 0;
      const completionTokens = data.usage?.completion_tokens ?? 0;
      const totalTokens = promptTokens + completionTokens;
      
      await supabase.from('ai_usage_metrics').insert({
        service_name: 'mega-cerebro-ai',
        endpoint: intent.type,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: totalTokens,
        model: usedModel,
        user_id: requestData.user_id || null,
        response_time_ms: responseTime
      });
    } catch (metricsErr) {
      console.warn('⚠️ Falha ao salvar métricas:', metricsErr);
    }

    console.log('✨ MEGA CÉREBRO: Resposta gerada com sucesso');

    return new Response(
      JSON.stringify({ 
        content: assistantReply,
        intent: intent.type,
        confidence: intent.confidence,
        ...moduleResponse.metadata
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('💥 Erro no MEGA CÉREBRO:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});