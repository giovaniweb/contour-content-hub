
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

    // Criar prompt consolidado seguindo as especificações completas
    const prompt = createConsolidatedFluidaPrompt(diagnosticData);
    console.log('📝 Prompt consolidado criado, tamanho:', prompt.length);

    console.log('🌐 Iniciando chamada OpenAI...');
    
    // P2-001: Configurações otimizadas com modelo atualizado
    const requestBody = {
      model: 'gpt-4.1-mini-2025-04-14', // Modelo mais eficiente para diagnósticos
      messages: [
        { 
          role: 'system', 
          content: getConsolidatedSystemPrompt()
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.6, // Reduzido para mais consistência
      max_tokens: 1500  // Reduzido de 4000 para otimizar custos
    };

    console.log('📦 Request configurado:', { model: requestBody.model, max_tokens: requestBody.max_tokens });
    
    // Chamada para OpenAI com timeout controlado de 60s
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏰ Timeout de 60s atingido');
      controller.abort();
    }, 60000);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify(requestBody),
    });

    clearTimeout(timeoutId);
    console.log('📡 Status da resposta OpenAI:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', response.status, errorText);
      
      return new Response(JSON.stringify({ 
        diagnostic: generateFallbackDiagnostic(diagnosticData),
        success: false,
        fallback: true,
        error: `OpenAI Error ${response.status}: ${errorText}`
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('📄 Resposta OpenAI recebida com sucesso');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('❌ Estrutura de resposta inválida da OpenAI');
      return new Response(JSON.stringify({ 
        diagnostic: generateFallbackDiagnostic(diagnosticData),
        success: false,
        fallback: true,
        error: 'Estrutura de resposta inválida'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const diagnosticResult = data.choices[0].message.content;
    console.log('✅ Diagnóstico gerado com sucesso, tamanho:', diagnosticResult?.length || 0);

    // Validar se o diagnóstico tem a estrutura obrigatória das 6 seções
    const hasRequiredSections = validateDiagnosticStructure(diagnosticResult);
    if (!hasRequiredSections) {
      console.warn('⚠️ Diagnóstico não possui estrutura completa, usando fallback');
      return new Response(JSON.stringify({ 
        diagnostic: generateFallbackDiagnostic(diagnosticData),
        success: false,
        fallback: true,
        error: 'Estrutura incompleta no diagnóstico'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      diagnostic: diagnosticResult,
      success: true,
      timestamp: new Date().toISOString(),
      model_used: 'gpt-4.1-mini-2025-04-14',
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

function getConsolidatedSystemPrompt(): string {
  // P2-001: Prompt otimizado (reduzido de ~500 para ~200 tokens)
  return `CONSULTOR FLUIDA - Diagnósticos para clínicas estéticas/médicas.

ESTRUTURA OBRIGATÓRIA:
📊 Diagnóstico | 💡 Conteúdo | 📅 Plano 4 Semanas | 🎨 Marca | 🧩 Enigma | 📈 Insights

Linguagem: Médica=técnica, Estética=emocional. Seja conciso e prático.

⚠️ Use EXATAMENTE os títulos com emojis especificados.`;
}

function createConsolidatedFluidaPrompt(data: any): string {
  // P2-001: Prompt otimizado (reduzido de ~300 para ~100 tokens)
  const tipo = data.clinicType === 'clinica_medica' ? 'MED' : 'EST';
  const key = tipo === 'MED' ? 'medical' : 'aesthetic';
  
  const especialidade = data[`${key}Specialty`] || data[`${key}Focus`] || 'N/A';
  const equipamentos = data[`${key}Equipments`] || 'N/A';
  const ticket = data[`${key}Ticket`] || 'N/A';
  const objetivo = data[`${key}Objective`] || 'N/A';
  
  return `Tipo: ${tipo}
Esp: ${especialidade}
Equip: ${equipamentos}
Ticket: ${ticket}
Meta: ${data.revenueGoal || 'N/A'}
Objetivo: ${objetivo}
Público: ${data.targetAudience || 'N/A'}
Desafios: ${data.mainChallenges || 'N/A'}

Gere diagnóstico FLUIDA com 6 seções obrigatórias.
Linguagem: ${tipo === 'MED' ? 'técnico-consultiva' : 'emocional-inspiradora'}.`;
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
  return foundSections >= 5;
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
