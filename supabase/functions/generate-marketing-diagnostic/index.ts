
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { checkRateLimit, createRateLimitResponse, getClientIdentifier, getRateLimitHeaders } from "../_shared/rateLimiting.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('🎯 CONSULTOR FLUIDA - Diagnóstico iniciado');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // P0-003: Rate limiting implementado
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    const authHeader = req.headers.get('authorization');
    let userId: string | undefined;
    
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const { data: { user } } = await supabase.auth.getUser(authHeader.split(' ')[1]);
        userId = user?.id;
      } catch (e) {
        console.log('Token inválido ou expirado');
      }
    }

    const identifier = getClientIdentifier(req, userId);
    const rateLimitResult = await checkRateLimit(identifier, {
      endpoint: 'generate-marketing-diagnostic',
      maxRequests: 10, // 10 diagnósticos por minuto por usuário/IP
      windowMinutes: 1
    });

    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(rateLimitResult, corsHeaders);
    }

    const diagnosticData = await req.json();
    console.log('📊 Parâmetros:', { 
      questionsAnswered: Object.keys(diagnosticData).length,
      stateKeys: Object.keys(diagnosticData)
    });

    // Validação da chave OpenAI
    if (!openAIApiKey) {
      console.error('❌ OPENAI_API_KEY não configurada!');
      return new Response(JSON.stringify({ 
        diagnostic: generateFallbackDiagnostic(diagnosticData),
        success: false,
        fallback: true,
        error: 'OPENAI_API_KEY não configurada'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Receber tier do modelo e preparar prompts JSON-first
    const { modelTier = 'standard', ...inputPayload } = diagnosticData || {} as any;

    // Definir constantes de modelos e roteador local (edge function não importa do frontend)
    type ModelTier = 'standard' | 'gpt5';
    const GPT5_CORE = 'gpt-5';
    const GPT5_MINI = 'gpt-5-mini';
    const G4_1 = 'gpt-4.1';
    const modelRouter = (tier: ModelTier): string[] => tier === 'gpt5' ? [GPT5_CORE, GPT5_MINI, G4_1] : [G4_1];

    const BAN_LIST: RegExp[] = [
      /ladeira\s*copywarrior/gi,
      /copywarrior/gi,
      /do\s+jeito\s+ladeira/gi,
      /metodologia\s+ladeira/gi
    ];

    const models = modelRouter(modelTier as ModelTier);
    const systemPrompt = getStructuredSystemPrompt();
    const userPrompt = createStructuredPrompt(inputPayload);

    console.log('🧭 Model routing:', { modelTier, models });

    let finalMarkdown = '';
    let usedModel = '';
    let totalTokens: number | null = null;
    let latencyMs = 0;
    let success = false;
    let lastError: string | null = null;

    for (const model of models) {
      const attemptStart = Date.now();
      try {
        // 18s timeout por tentativa
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 18000);

        const body = {
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.6,
          max_tokens: 1500,
          response_format: { type: 'json_object' }
        } as const;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          body: JSON.stringify(body),
        });

        clearTimeout(timeoutId);
        latencyMs = Date.now() - attemptStart;
        console.log('📡 OpenAI status:', { model, status: response.status, latencyMs });

        if (!response.ok) {
          const errorText = await response.text();
          lastError = `OpenAI Error ${response.status}: ${errorText}`;
          console.warn('⚠️ Tentativa falhou:', lastError);
          continue;
        }

        const data = await response.json();
        totalTokens = data?.usage?.total_tokens ?? null;
        const content = data?.choices?.[0]?.message?.content;
        if (!content) {
          lastError = 'Resposta sem conteúdo';
          continue;
        }

        let parsed: any;
        try {
          parsed = JSON.parse(content);
        } catch (e) {
          lastError = 'JSON inválido na resposta';
          continue;
        }

        if (!validateStructuredDiagnostic(parsed)) {
          lastError = 'Schema inválido (6 seções + plano 4 semanas)';
          continue;
        }

        // Sanitizar e renderizar
        const sanitized = sanitizeStructuredDiagnostic(parsed, BAN_LIST);
        finalMarkdown = renderMarkdownFromStructured(sanitized);
        usedModel = model;
        success = true;
        break; // sucesso; não tentar próximos modelos
      } catch (err: any) {
        latencyMs = Date.now() - attemptStart;
        lastError = err?.name === 'AbortError' ? 'Timeout (18s) na tentativa' : (err?.message || 'Erro desconhecido');
        console.warn('⚠️ Erro na tentativa:', { model, lastError });
        continue;
      }
    }

    // Telemetria (não bloquear a resposta em caso de erro)
    try {
      await supabase.rpc('update_ai_performance_metrics', {
        p_service_name: 'generate-marketing-diagnostic',
        p_success: success,
        p_response_time_ms: latencyMs,
        p_tokens_used: totalTokens,
        p_estimated_cost: null
      });
    } catch (e) {
      console.log('ℹ️ Telemetria falhou silenciosamente:', e?.message || e);
    }

    if (!success) {
      console.warn('🔄 Todas as tentativas falharam, retornando fallback:', lastError);
      return new Response(JSON.stringify({ 
        diagnostic: generateFallbackDiagnostic(diagnosticData),
        success: false,
        fallback: true,
        error: lastError || 'Falha ao gerar diagnóstico'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validação extra por segurança (estrutura textual)
    const hasRequiredSections = validateDiagnosticStructure(finalMarkdown);
    if (!hasRequiredSections) {
      console.warn('⚠️ Markdown final sem as 6 seções, usando fallback');
      return new Response(JSON.stringify({ 
        diagnostic: generateFallbackDiagnostic(diagnosticData),
        success: false,
        fallback: true,
        error: 'Estrutura incompleta no markdown final'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      diagnostic: finalMarkdown,
      success: true,
      timestamp: new Date().toISOString(),
      model_used: usedModel,
      model_tier: modelTier,
      latency_ms: latencyMs,
      tokens_used: totalTokens,
      clinic_type: diagnosticData.clinicType,
      equipments_validated: await validateEquipments(diagnosticData)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

    
  } catch (error) {
    console.error('💥 Erro geral:', error);
    
    const diagnosticData = await req.json().catch(() => ({}));
    
    return new Response(JSON.stringify({ 
      diagnostic: generateFallbackDiagnostic(diagnosticData),
      success: false,
      fallback: true,
      error: error.message || 'Erro desconhecido',
      error_details: error.name === 'AbortError' ? 'Timeout na chamada da OpenAI (60s)' : 'Erro interno'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getStructuredSystemPrompt(): string {
  return `Você é o CONSULTOR FLUIDA para clínicas estéticas/médicas.
Responda ESTRITAMENTE em JSON (sem markdown, sem comentários), com este esquema:
{
  "secoes": [
    { "titulo": string, "conteudo": string }, // 6 itens, na ordem
    ...
  ],
  "plano4Semanas": [
    { "semana": 1, "datasRelativas": string, "entregaveis": { "instagram": string[], "tiktok"?: string[], "youtube"?: string[], "blog"?: string[] }, "kpis": string[] },
    { "semana": 2, ... },
    { "semana": 3, ... },
    { "semana": 4, ... }
  ]
}
Títulos obrigatórios (exatos, nesta ordem):
1) 📊 Diagnóstico Estratégico da Clínica
2) 💡 Sugestões de Conteúdo Personalizado
3) 📅 Plano de Ação Semanal
4) 🎨 Avaliação de Marca e Atendimento
5) 🧩 Enigma do Mentor
6) 📈 Insights Estratégicos Fluida`;
}

function createStructuredPrompt(data: any): string {
  const tipo = data.clinicType === 'clinica_medica' ? 'MÉDICA' : 'ESTÉTICA';
  const key = data.clinicType === 'clinica_medica' ? 'medical' : 'aesthetic';
  const especialidade = data[`${key}Specialty`] || data[`${key}Focus`] || 'N/A';
  const equipamentos = data[`${key}Equipments`] || 'N/A';
  const ticket = data[`${key}Ticket`] || 'N/A';
  const objetivo = data[`${key}Objective`] || 'N/A';
  const publico = data.targetAudience || 'N/A';
  const desafios = data.mainChallenges || 'N/A';
  const metaReceita = data.revenueGoal || 'N/A';

  return `Contexto:
Tipo de Clínica: ${tipo}
Especialidade: ${especialidade}
Equipamentos: ${equipamentos}
Ticket Médio: ${ticket}
Objetivo: ${objetivo}
Meta de Receita: ${metaReceita}
Público-Alvo: ${publico}
Principais Desafios: ${desafios}

Gere as 6 seções (titulo + conteudo) e um plano de 4 semanas com datas relativas, entregáveis por canal e KPIs, no JSON solicitado.`;
}

function validateStructuredDiagnostic(obj: any): boolean {
  try {
    if (!obj || !Array.isArray(obj.secoes) || obj.secoes.length !== 6) return false;
    for (const s of obj.secoes) {
      if (!s || typeof s.titulo !== 'string' || typeof s.conteudo !== 'string' || !s.titulo.trim() || !s.conteudo.trim()) return false;
    }
    if (!Array.isArray(obj.plano4Semanas) || obj.plano4Semanas.length !== 4) return false;
    for (let i = 0; i < 4; i++) {
      const w = obj.plano4Semanas[i];
      if (!w) return false;
      if (typeof w.semana !== 'number' || w.semana !== i + 1) return false;
      if (typeof w.datasRelativas !== 'string' || !w.datasRelativas.trim()) return false;
      if (typeof w.entregaveis !== 'object' || !w.entregaveis) return false;
      if (!Array.isArray(w.kpis) || w.kpis.length === 0) return false;
    }
    return true;
  } catch {
    return false;
  }
}

function sanitizeStructuredDiagnostic(obj: any, banList: RegExp[]): any {
  const sanitize = (text: string) => banList.reduce((acc, re) => acc.replace(re, ''), text).replace(/\s{2,}/g, ' ').trim();
  const clone = JSON.parse(JSON.stringify(obj));
  clone.secoes = clone.secoes.map((s: any) => ({
    titulo: sanitize(s.titulo),
    conteudo: sanitize(s.conteudo)
  }));
  clone.plano4Semanas = clone.plano4Semanas.map((w: any) => ({
    semana: w.semana,
    datasRelativas: sanitize(w.datasRelativas),
    entregaveis: Object.fromEntries(Object.entries(w.entregaveis || {}).map(([k, v]: any) => [k, Array.isArray(v) ? v.map((t: string) => sanitize(t)) : v])),
    kpis: Array.isArray(w.kpis) ? w.kpis.map((t: string) => sanitize(t)) : []
  }));
  return clone;
}

function renderMarkdownFromStructured(obj: any): string {
  const titles = [
    '📊 Diagnóstico Estratégico da Clínica',
    '💡 Sugestões de Conteúdo Personalizado',
    '📅 Plano de Ação Semanal',
    '🎨 Avaliação de Marca e Atendimento',
    '🧩 Enigma do Mentor',
    '📈 Insights Estratégicos Fluida'
  ];

  const secoes = obj.secoes as Array<{ titulo: string; conteudo: string }>;
  const plano = obj.plano4Semanas as Array<{ semana: number; datasRelativas: string; entregaveis: Record<string, string[]>; kpis: string[] }>;

  const s1 = `## ${titles[0]}\n\n${secoes[0].conteudo.trim()}`;
  const s2 = `## ${titles[1]}\n\n${secoes[1].conteudo.trim()}`;

  const planoLines: string[] = [
    `## ${titles[2]}`,
    ''
  ];
  for (const w of plano) {
    planoLines.push(`**Semana ${w.semana} — ${w.datasRelativas}**`);
    for (const [canal, itens] of Object.entries(w.entregaveis || {})) {
      if (Array.isArray(itens) && itens.length) {
        planoLines.push(`- ${canal}:`);
        itens.forEach((it) => planoLines.push(`  - ${it}`));
      }
    }
    if (Array.isArray(w.kpis) && w.kpis.length) {
      planoLines.push(`- KPIs:`);
      w.kpis.forEach((k) => planoLines.push(`  - ${k}`));
    }
    planoLines.push('');
  }

  const s4 = `## ${titles[3]}\n\n${secoes[3].conteudo.trim()}`;
  const s5 = `## ${titles[4]}\n\n${secoes[4].conteudo.trim()}`;
  const s6 = `## ${titles[5]}\n\n${secoes[5].conteudo.trim()}`;

  return [s1, s2, planoLines.join('\n'), s4, s5, s6, '\n---\n*Gerado pelo Consultor Fluida*'].join('\n\n');
}


// Função para validar se o diagnóstico tem as 6 seções obrigatórias
function validateDiagnosticStructure(diagnostic: string): boolean {
  const requiredSections = [
    '📊 Diagnóstico Estratégico da Clínica',
    '💡 Sugestões de Conteúdo Personalizado',
    '📅 Plano de Ação Semanal',
    '🎨 Avaliação de Marca e Atendimento',
    '🧩 Enigma do Mentor',
    '📈 Insights Estratégicos Fluida'
  ];
  
  let foundSections = 0;
  requiredSections.forEach(section => {
    if (diagnostic.includes(section)) {
      foundSections++;
    }
  });
  
  console.log(`🔍 Estrutura validada: ${foundSections}/6 seções encontradas`);
  return foundSections >= 6;
}

// Função para gerar fallback estruturado
function generateFallbackDiagnostic(data: any): string {
  const tipoClinica = data.clinicType === 'clinica_medica' ? 'Médica' : 'Estética';
  const isClinicaMedica = data.clinicType === 'clinica_medica';
  
  return `## 📊 Diagnóstico Estratégico da Clínica

⚠️ **Geração automática indisponível. Exibindo sugestões padrão com base no seu perfil.**

**Tipo:** Clínica ${tipoClinica}
**Análise:** Sua clínica possui potencial de crescimento. ${isClinicaMedica ? 'Como clínica médica, o foco deve ser autoridade científica e credibilidade.' : 'Como clínica estética, o foco deve ser transformação visual e experiência do cliente.'}

## 💡 Sugestões de Conteúdo Personalizado

1. **Posts educativos** sobre ${isClinicaMedica ? 'procedimentos médicos' : 'tratamentos estéticos'}
2. **Antes e depois** de casos reais (respeitando privacidade)
3. **Stories com dicas** rápidas e práticas
4. **Reels explicativos** sobre diferenciais da clínica

## 📅 Plano de Ação Semanal

**Semana 1:** Estruturar linha editorial
**Semana 2:** Criar conteúdo de autoridade
**Semana 3:** Implementar campanhas de captação
**Semana 4:** Otimizar e mensurar resultados

## 🎨 Avaliação de Marca e Atendimento

- Revisar identidade visual
- Alinhar atendimento com posicionamento
- Criar programa de indicação

## 🧩 Enigma do Mentor

"Quem planta consistência, colhe resultados duradouros..."

## 📈 Insights Estratégicos Fluida

- Consistência na comunicação é fundamental
- ${isClinicaMedica ? 'Autoridade técnica gera confiança' : 'Transformação visual gera desejo'}
- Investir em relacionamento com pacientes

---
*Diagnóstico temporariamente indisponível. Suas respostas foram salvas e você pode tentar novamente em instantes.*`;
}

// Função para validar equipamentos (simples, pode ser expandida)
async function validateEquipments(data: any): Promise<string[]> {
  const equipments = data.clinicType === 'clinica_medica' 
    ? (data.medicalEquipments || '')
    : (data.aestheticEquipments || '');
    
  if (!equipments) return [];
  
  return equipments.split(',').map((eq: string) => eq.trim()).filter(Boolean);
}

// Funções auxiliares de formatação
function formatRevenue(revenue: string): string {
  const map: { [key: string]: string } = {
    'ate_15k': 'Até R$ 15.000/mês',
    '15k_30k': 'R$ 15.000 - R$ 30.000/mês',
    '30k_60k': 'R$ 30.000 - R$ 60.000/mês',
    'acima_60k': 'Acima de R$ 60.000/mês'
  };
  return map[revenue] || revenue || 'Não informado';
}

function formatGoal(goal: string): string {
  const map: { [key: string]: string } = {
    'crescer_30': 'Crescer 30% em 3 meses',
    'crescer_50': 'Crescer 50% em 3 meses',
    'dobrar': 'Dobrar em 6 meses',
    'triplicar': 'Triplicar em 1 ano',
    'manter_estavel': 'Manter estabilidade'
  };
  return map[goal] || goal || 'Não informado';
}

function formatMedicalObjective(objective: string): string {
  const map: { [key: string]: string } = {
    'autoridade_medica': 'Aumentar autoridade médica',
    'escalar_consultorio': 'Escalar consultório',
    'fidelizar_pacientes': 'Melhorar retenção de pacientes',
    'diferenciar_mercado': 'Diferenciar no mercado'
  };
  return map[objective] || objective || 'Não informado';
}

function formatAestheticObjective(objective: string): string {
  const map: { [key: string]: string } = {
    'atrair_leads': 'Atrair leads qualificados',
    'aumentar_recorrencia': 'Aumentar recorrência',
    'elevar_ticket': 'Aumentar ticket médio',
    'autoridade_regiao': 'Ser referência na região'
  };
  return map[objective] || objective || 'Não informado';
}

function formatMedicalTicket(ticket: string): string {
  const map: { [key: string]: string } = {
    'ate_500': 'Até R$ 500',
    '500_1500': 'R$ 500 - R$ 1.500',
    '1500_3000': 'R$ 1.500 - R$ 3.000',
    '3000_5000': 'R$ 3.000 - R$ 5.000',
    'acima_5000': 'Acima de R$ 5.000'
  };
  return map[ticket] || ticket || 'Não informado';
}

function formatAestheticTicket(ticket: string): string {
  const map: { [key: string]: string } = {
    'ate_150': 'Até R$ 150',
    '150_300': 'R$ 150 - R$ 300',
    '300_600': 'R$ 300 - R$ 600',
    '600_1000': 'R$ 600 - R$ 1.000',
    'acima_1000': 'Acima de R$ 1.000'
  };
  return map[ticket] || ticket || 'Não informado';
}
