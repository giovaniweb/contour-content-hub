
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('🚀 CONSULTOR FLUIDA - Diagnóstico iniciado');
  console.log('📝 Method:', req.method);
  console.log('🔑 OpenAI Key present:', !!openAIApiKey);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const diagnosticData = await req.json();
    console.log('📊 Dados do diagnóstico recebidos:', JSON.stringify(diagnosticData, null, 2));

    if (!openAIApiKey) {
      console.error('❌ OPENAI_API_KEY não configurada!');
      return new Response(JSON.stringify({ 
        error: 'OPENAI_API_KEY não configurada - Configure a chave da OpenAI nas configurações do projeto',
        success: false,
        details: 'A chave da OpenAI precisa ser configurada nos secrets do Supabase'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = createConsultorFluidaPrompt(diagnosticData);
    console.log('📝 Prompt criado, tamanho:', prompt.length);

    console.log('🌐 Chamando OpenAI API...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `Você é o CONSULTOR FLUIDA — especialista em marketing para clínicas médicas e estéticas.

MISSÃO: Gerar diagnóstico seguindo EXATAMENTE as 6 seções obrigatórias:

1. 📊 Diagnóstico Estratégico
2. 💡 Sugestões de Conteúdo Personalizado  
3. 📅 Plano de Ação Semanal
4. 🎨 Avaliação de Marca e Atendimento
5. 🧩 Enigma do Mentor
6. 📈 Insights Estratégicos Fluida

REGRAS:
- Use EXATAMENTE esses títulos com emojis
- Conteúdo apenas para Instagram/TikTok/Shorts
- Adapte linguagem: Médica = técnica | Estética = emocional
- Plano de 4 semanas com tarefas práticas
- Enigma inspirador sem revelar mentor
- Seja consultivo e prático` 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 3500
      }),
    });

    console.log('📡 Status da resposta OpenAI:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', response.status, errorText);
      
      return new Response(JSON.stringify({ 
        error: `Erro na OpenAI: ${response.status}`,
        success: false,
        details: errorText
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('📄 Resposta OpenAI recebida');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('❌ Estrutura de resposta inválida da OpenAI');
      return new Response(JSON.stringify({ 
        error: 'Resposta inválida da OpenAI',
        success: false 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const diagnosticResult = data.choices[0].message.content;
    console.log('✅ Diagnóstico gerado com sucesso, tamanho:', diagnosticResult?.length || 0);

    return new Response(JSON.stringify({ 
      diagnostic: diagnosticResult,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('💥 Erro geral:', error);
    console.error('💥 Stack:', error.stack);
    
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor',
      success: false,
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function createConsultorFluidaPrompt(data: any): string {
  const tipoClinica = data.clinicType === 'clinica_medica' ? 'Médica' : 'Estética';
  const isClinicaMedica = data.clinicType === 'clinica_medica';
  
  // Detectar dados principais
  const especialidade = isClinicaMedica 
    ? (data.medicalSpecialty || 'Não informado')
    : (data.aestheticFocus || 'Não informado');

  const equipamentos = isClinicaMedica
    ? (data.medicalEquipments || 'Não informado')
    : (data.aestheticEquipments || 'Não informado');

  const protocolo = isClinicaMedica
    ? (data.medicalBestSeller || 'Não informado')
    : (data.aestheticBestSeller || 'Não informado');

  const ticketMedio = isClinicaMedica
    ? formatMedicalTicket(data.medicalTicket)
    : formatAestheticTicket(data.aestheticTicket);

  const objetivo = isClinicaMedica
    ? formatMedicalObjective(data.medicalObjective)
    : formatAestheticObjective(data.aestheticObjective);

  const frequencia = data.contentFrequency || 'Não informado';
  const faturamento = formatRevenue(data.currentRevenue);
  const meta = formatGoal(data.revenueGoal);

  const prompt = `🎯 CONSULTOR FLUIDA - DIAGNÓSTICO PERSONALIZADO

📋 BRIEFING DA CLÍNICA:
• Tipo: ${tipoClinica}
• Especialidade: ${especialidade}
• Equipamentos: ${equipamentos}
• Protocolo principal: ${protocolo}
• Ticket médio: ${ticketMedio}
• Faturamento: ${faturamento}
• Meta: ${meta}
• Objetivo: ${objetivo}
• Frequência de conteúdo: ${frequencia}
• Público-alvo: ${data.targetAudience || 'Não definido'}
• Desafios: ${data.mainChallenges || 'Não informado'}

---

🎯 GERE UM DIAGNÓSTICO COMPLETO COM AS 6 SEÇÕES:

## 📊 Diagnóstico Estratégico
[Analise o perfil da clínica, identifique gargalos e oportunidades]

## 💡 Sugestões de Conteúdo Personalizado
[3-5 ideias práticas para Instagram/TikTok/Shorts usando os equipamentos mencionados]

## 📅 Plano de Ação Semanal
[4 semanas com 3-4 tarefas práticas cada:
Semana 1: Autoridade e visibilidade
Semana 2: Prova social e diferencial  
Semana 3: Conversão e campanha
Semana 4: Aceleração e fidelização]

## 🎨 Avaliação de Marca e Atendimento
[Analise identidade visual, atendimento vs posicionamento, sugira melhorias]

## 🧩 Enigma do Mentor
[Frase inspiradora sobre marketing/crescimento sem revelar nome do mentor]

## 📈 Insights Estratégicos Fluida
[3-5 insights práticos sobre equipamentos, posicionamento, crescimento]

⚠️ IMPORTANTE:
- Linguagem ${isClinicaMedica ? 'técnica e consultiva' : 'emocional e humanizada'}
- Apenas conteúdo para redes sociais (nunca blog/webinar)
- ${!isClinicaMedica ? 'APENAS equipamentos estéticos (não médicos)' : 'Pode mencionar equipamentos médicos e estéticos'}`;

  return prompt;
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
