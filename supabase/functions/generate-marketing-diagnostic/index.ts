
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
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const diagnosticData = await req.json();
    console.log('📊 Dados do diagnóstico recebidos');

    if (!openAIApiKey) {
      console.error('❌ OPENAI_API_KEY não configurada!');
      return new Response(JSON.stringify({ 
        error: 'OPENAI_API_KEY não configurada',
        success: false 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = createConsultorFluidaPrompt(diagnosticData);
    console.log('📝 Prompt do Consultor Fluida criado');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: `🧠 Você é o CONSULTOR FLUIDA — estrategista oficial da plataforma para clínicas estéticas e médicas.

Sua missão é gerar um diagnóstico completo seguindo EXATAMENTE as 6 etapas estruturadas:

1. 📊 Diagnóstico Estratégico da Clínica
2. 💡 Sugestões de Conteúdo Personalizado (somente Instagram, Reels, TikTok, Shorts)
3. 📅 Plano de Ação Semanal (4 semanas)
4. 🎨 Avaliação de Marca e Atendimento
5. 🧩 Enigma do Mentor
6. 📈 Insights Estratégicos Fluida

⚠️ REGRAS CRÍTICAS:
- Use EXATAMENTE esses títulos com emojis para cada seção
- Conteúdo apenas para Instagram/TikTok/Shorts (nunca blog, webinar, live)
- Adapte linguagem: Médica = técnica/autoridade | Estética = emocional/humanizada
- Inclua pelo menos 3 ideias de conteúdo usando equipamentos citados
- Plano de 4 semanas com 3-4 tarefas práticas por semana
- Enigma sem revelar nome do mentor
- Insights práticos e consultivos

🎯 Fluxo de Segmentação:
- Clínica Médica → Pode ver todos os equipamentos
- Clínica Estética → Apenas equipamentos não invasivos
- Inferência: Unyque PRO/Reverso/Enygma = MÉDICA | Crystal 3D/Crio/Multishape = ESTÉTICA` 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.85,
        max_tokens: 4000
      }),
    });

    if (!response.ok) {
      console.error('❌ OpenAI API error:', response.status);
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const diagnosticResult = data.choices[0].message.content;
    console.log('✅ Diagnóstico Fluida gerado com sucesso');

    return new Response(JSON.stringify({ 
      diagnostic: diagnosticResult,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('💥 Erro no Consultor Fluida:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro ao gerar diagnóstico com IA',
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
  
  // Detectar especialidade/foco principal
  const especialidade = isClinicaMedica 
    ? (data.medicalSpecialty || 'Não informado')
    : (data.aestheticFocus || 'Não informado');

  // Detectar procedimentos principais
  const procedimentos = isClinicaMedica
    ? (data.medicalProcedures || 'Não informado')
    : (data.aestheticBestSeller || 'Não informado');

  // Detectar equipamentos utilizados
  const equipamentos = isClinicaMedica
    ? (data.medicalEquipments || 'Não informado')
    : (data.aestheticEquipments || 'Não informado');

  // Detectar protocolo mais vendido
  const protocolo = isClinicaMedica
    ? (data.medicalBestSeller || 'Não informado')
    : (data.aestheticBestSeller || 'Não informado');

  // Detectar ticket médio
  const ticketMedio = isClinicaMedica
    ? formatMedicalTicket(data.medicalTicket)
    : formatAestheticTicket(data.aestheticTicket);

  // Detectar modelo de vendas
  const modeloVenda = isClinicaMedica
    ? (data.medicalSalesModel || 'Não informado')
    : (data.aestheticSalesModel || 'Não informado');

  // Detectar objetivo principal
  const objetivo = isClinicaMedica
    ? formatMedicalObjective(data.medicalObjective)
    : formatAestheticObjective(data.aestheticObjective);

  // Detectar frequência de conteúdo
  const frequencia = isClinicaMedica
    ? (data.medicalContentFrequency || data.contentFrequency || 'Não informado')
    : (data.aestheticContentFrequency || data.contentFrequency || 'Não informado');

  // Detectar se aparece nos vídeos
  const apareceVideos = detectaAparicaoVideos(data);

  // Detectar estilo da clínica
  const estiloClinica = isClinicaMedica
    ? (data.medicalClinicStyle || 'Não definido')
    : (data.aestheticClinicStyle || 'Não definido');

  const prompt = `🎯 CONSULTOR FLUIDA - PROMPT FINAL
Gere um diagnóstico estratégico completo seguindo EXATAMENTE as 6 etapas estruturadas:

📥 DADOS DE BRIEFING:
• Tipo: ${tipoClinica}
• Especialidade: ${especialidade}
• Procedimentos: ${procedimentos}
• Equipamentos: ${equipamentos}
• Protocolo mais vendido: ${protocolo}
• Ticket médio: ${ticketMedio}
• Modelo de venda: ${modeloVenda}
• Faturamento atual: ${formatRevenue(data.currentRevenue)}
• Meta 3 meses: ${formatGoal(data.revenueGoal)}
• Objetivo de marketing: ${objetivo}
• Frequência de conteúdo: ${frequencia}
• Aparece nos vídeos? ${apareceVideos}
• Público ideal: ${data.targetAudience || 'Não definido'}
• Estilo da clínica: ${estiloClinica}
• Estilo de linguagem desejado: ${formatCommunicationStyle(data.communicationStyle)}

---

🎯 RESPONDA COM AS 6 ETAPAS OBRIGATÓRIAS:

## 📊 Diagnóstico Estratégico da Clínica
[Identifique gargalos do negócio, desalinhamento entre público/oferta/visual/autoridade. Use tom ${isClinicaMedica ? 'técnico e consultivo' : 'emocional e humanizado'}]

## 💡 Sugestões de Conteúdo Personalizado
[3-5 ideias práticas APENAS para Instagram/TikTok/Shorts. Inclua pelo menos 3 ideias usando ${equipamentos}. Seja criativo e humano]

## 📅 Plano de Ação Semanal (4 semanas)
[
Semana 1: Autoridade e visibilidade (3-4 tarefas práticas)
Semana 2: Prova social e diferencial (3-4 tarefas práticas)  
Semana 3: Conversão e campanha (3-4 tarefas práticas)
Semana 4: Aceleração e fidelização (3-4 tarefas práticas)
]

## 🎨 Avaliação de Marca e Atendimento
[Avalie identidade visual, atendimento vs posicionamento, sugira melhorias e programa de indicação]

## 🧩 Enigma do Mentor
[Frase misteriosa com trocadilho sobre mentor (sem revelar nome). Ex: "Esse plano foi guiado por alguém que transforma 'ladainha' em lucro..."]

## 📈 Insights Estratégicos Fluida
[3-5 insights práticos consultivos sobre equipamento, posicionamento, branding. Ex: "Você não aparece nos vídeos — isso pode estar limitando seu alcance"]

---

⚠️ CONTROLE DE ACESSO:
- Tipo detectado: ${tipoClinica}
- ${isClinicaMedica ? 'PODE sugerir equipamentos médicos E estéticos' : 'APENAS equipamentos estéticos (NÃO médicos)'}
- ${!isClinicaMedica ? 'NUNCA mencione: CO2, HIFU, Laser Fracionado, Intradermoterapia' : ''}

⚠️ REGRAS FINAIS:
- Proibido: live, blog, ebook, webinar
- Apenas conteúdo de rede social
- Linguagem adaptada ao público
- Diagnóstico consultivo e prático`;

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

function formatCommunicationStyle(style: string): string {
  const map: { [key: string]: string } = {
    'emocional_inspirador': 'Emocional e Inspirador',
    'tecnico_didatico': 'Técnico e Didático',
    'humanizado_proximo': 'Humanizado e Próximo',
    'direto_objetivo': 'Direto e Objetivo'
  };
  return map[style] || style || 'Não definido';
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

function detectaAparicaoVideos(data: any): string {
  const medical = data.medicalContentFrequency;
  const aesthetic = data.aestheticContentFrequency;
  
  if (medical && (medical.includes('aparece') || medical.includes('sempre'))) return 'Sim, aparece regularmente';
  if (aesthetic && (aesthetic.includes('aparece') || aesthetic.includes('sempre'))) return 'Sim, aparece regularmente';
  if (medical && medical.includes('nunca')) return 'Não aparece nos vídeos';
  if (aesthetic && aesthetic.includes('nunca')) return 'Não aparece nos vídeos';
  
  return 'Não especificado';
}
