
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
            content: `🧠 Você é o CONSULTOR FLUIDA — um estrategista de marketing altamente treinado para clínicas estéticas e clínicas médicas.

Seu papel é conduzir um diagnóstico inteligente com base nas respostas do usuário, identificando o perfil da clínica, seus principais gargalos e oportunidades, e entregando uma resposta organizada com plano de ação, ideias de conteúdo, e previsão de crescimento.

⚙️ Sua inteligência inclui:
- Classificação automática entre Clínica Médica 🧪 e Clínica Estética 💆‍♀️
- Diferenciação entre equipamentos médicos e estéticos
- Geração de conteúdo prático para Instagram, TikTok e YouTube Shorts
- Linguagem adaptada ao perfil do usuário (emocional, técnica, humanizada…)
- Humor leve e enigmático com referência a mentores fictícios

🔐 REGRAS DE ACESSO IMPORTANTES:
- Se for CLÍNICA MÉDICA: pode sugerir TODOS os equipamentos (médicos e estéticos)
- Se for CLÍNICA ESTÉTICA: pode sugerir APENAS equipamentos estéticos
- NUNCA sugira equipamentos médicos (CO2 Fracionado, Ultrassom microfocado, Intradermoterapia) para clínicas estéticas

⚠️ Regras de Conteúdo:
- Nunca sugira conteúdo complexo como blog, webinar ou live
- Sempre pense no cliente da clínica (não no profissional)
- Use uma estrutura leve, fluida e inspiradora
- Nunca revele o nome do mentor
- Os títulos devem ser claros, com emojis, frases curtas e CTA
- Use somente Instagram, TikTok ou Shorts` 
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
  
  // Dados básicos da clínica
  const dadosBasicos = {
    tipo: tipoClinica,
    faturamentoAtual: formatRevenue(data.currentRevenue),
    metaCrescimento: formatGoal(data.revenueGoal),
    publicoIdeal: data.targetAudience || 'Não definido',
    estiloLinguagem: formatCommunicationStyle(data.communicationStyle),
    frequenciaConteudo: formatContentFrequency(data.contentFrequency),
    desafiosPrincipais: formatChallenges(data.mainChallenges)
  };

  // Dados específicos por tipo de clínica
  let perfilClinico = '';
  if (isClinicaMedica) {
    perfilClinico = `
🧪 PERFIL CLÍNICA MÉDICA:
- Especialidade: ${data.medicalSpecialty || 'Não informado'}
- Procedimentos: ${data.medicalProcedures || 'Não informado'}
- Equipamentos médicos: ${data.medicalEquipments || 'Não informado'}
- Tratamentos oferecidos: ${data.medicalTreatments || 'Não informado'}
- Protocolo mais vendido: ${data.medicalBestSeller || 'Não informado'}
- Ticket médio: ${formatMedicalTicket(data.medicalTicket)}
- Modelo de vendas: ${data.medicalSalesModel || 'Não informado'}
- Objetivo principal: ${data.medicalObjective || 'Não informado'}
- Aparece em conteúdos: ${data.medicalContentFrequency || 'Não informado'}
- Estilo da clínica: ${data.medicalClinicStyle || 'Não informado'}`;
  } else {
    perfilClinico = `
💆‍♀️ PERFIL CLÍNICA ESTÉTICA:
- Foco de atuação: ${data.aestheticFocus || 'Não informado'}
- Equipamentos estéticos: ${data.aestheticEquipments || 'Não informado'}
- Promessas de tratamento: ${data.aestheticPromises || 'Não informado'}
- Protocolo mais vendido: ${data.aestheticBestSeller || 'Não informado'}
- Ticket médio: ${formatAestheticTicket(data.aestheticTicket)}
- Modelo de vendas: ${data.aestheticSalesModel || 'Não informado'}
- Objetivo principal: ${data.aestheticObjective || 'Não informado'}
- Aparece em conteúdos: ${data.aestheticContentFrequency || 'Não informado'}
- Estilo da clínica: ${data.aestheticClinicStyle || 'Não informado'}`;
  }

  const prompt = `🧠 CONSULTOR FLUIDA - Diagnóstico Inteligente

Analyze o perfil da clínica e gere um diagnóstico estruturado seguindo EXATAMENTE as seções abaixo:

📥 DADOS DE ENTRADA:
${perfilClinico}

📊 DADOS FINANCEIROS E COMUNICAÇÃO:
- Faturamento atual: ${dadosBasicos.faturamentoAtual}
- Meta de crescimento: ${dadosBasicos.metaCrescimento}
- Público-alvo: ${dadosBasicos.publicoIdeal}
- Estilo de linguagem: ${dadosBasicos.estiloLinguagem}
- Frequência de posts: ${dadosBasicos.frequenciaConteudo}
- Principais desafios: ${dadosBasicos.desafiosPrincipais}

---

🎯 RESPONDA COM AS SEÇÕES ABAIXO (estrutura obrigatória):

## 📊 Diagnóstico Estratégico
[Analise o perfil da clínica, gargalos de comunicação e posicionamento. Aponte se há desalinhamento entre imagem, tráfego e oferta. Adapte o tom ao tipo de clínica (médica = autoridade; estética = humanização)]

## 💡 Ideias de Conteúdo Inteligente
[Crie 4 a 6 ideias de conteúdo REAIS para o cliente final. Use somente Instagram, TikTok ou Shorts. Inclua pelo menos 1 conteúdo com equipamento (se aplicável). Tipos: bastidores, transformação, depoimento, skincare game, storytelling, dúvida comum. Dê TÍTULO + explicação + emoji]

## 📅 Plano de Ação – 3 Semanas
[
Semana 1: Visibilidade e autoridade
Semana 2: Prova social e conexão  
Semana 3: Conversão e fidelização
Para cada semana, gere 3 ações práticas com CTA claros. Use linguagem adaptada ao perfil
]

## 🧩 Enigma Satírico do Mentor
[Crie uma frase final com tom misterioso e irônico, sem citar o mentor real. Exemplo: "Essa estratégia parece coisa de quem vive no palco… mas atua melhor nos bastidores. Sempre vendendo sem parecer que está vendendo."]

## 💸 Projeção de Crescimento
[
Mostre: Faturamento atual
Estime: Projeção com o plano
Calcule: Crescimento potencial (ex: +40%)
Use o intervalo do simulador como base
]

---

🔐 CONTROLE DE ACESSO:
- Tipo detectado: ${tipoClinica}
- ${isClinicaMedica ? 'PODE sugerir equipamentos médicos E estéticos' : 'APENAS equipamentos estéticos (NÃO médicos)'}
- ${!isClinicaMedica ? 'NUNCA mencione: CO2, HIFU, Laser Fracionado, Intradermoterapia' : ''}

⚠️ LEMBRE-SE:
- Foque no CLIENTE FINAL da clínica
- Conteúdo apenas para Instagram/TikTok/Shorts
- Linguagem ${dadosBasicos.estiloLinguagem}
- Tom inspirador e prático`;

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
    'crescer_30': 'Crescer 30% em 6 meses',
    'crescer_50': 'Crescer 50% em 6 meses',
    'dobrar': 'Dobrar em 1 ano',
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

function formatContentFrequency(freq: string): string {
  const map: { [key: string]: string } = {
    'diario': 'Diariamente',
    'semanal': 'Semanalmente',
    'quinzenal': 'Quinzenalmente',
    'mensal': 'Mensalmente',
    'raramente': 'Raramente',
    'nao_posto': 'Não posta'
  };
  return map[freq] || freq || 'Não informado';
}

function formatChallenges(challenges: string): string {
  const map: { [key: string]: string } = {
    'gerar_leads': 'Gerar leads qualificados',
    'converter_vendas': 'Converter leads em vendas',
    'fidelizar_clientes': 'Fidelizar clientes',
    'competir_preco': 'Competir sem baixar preço',
    'criar_conteudo': 'Criar conteúdo relevante',
    'gestao_tempo': 'Gestão de tempo'
  };
  return map[challenges] || challenges || 'Não informado';
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
