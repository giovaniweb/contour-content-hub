
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('🎯 CONSULTOR FLUIDA - Diagnóstico iniciado');
  console.log('📝 Method:', req.method);
  console.log('🔑 OpenAI Key present:', !!openAIApiKey);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const diagnosticData = await req.json();
    console.log('📊 Dados do diagnóstico recebidos:', JSON.stringify(diagnosticData, null, 2));

    // Validação da chave OpenAI
    if (!openAIApiKey) {
      console.error('❌ OPENAI_API_KEY não configurada!');
      return new Response(JSON.stringify({ 
        error: 'OPENAI_API_KEY não configurada - Configure a chave da OpenAI nas configurações do projeto',
        success: false,
        diagnostic: 'Diagnóstico temporariamente indisponível. Suas respostas foram salvas com segurança.',
        fallback: true
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Criar prompt seguindo as especificações completas
    const prompt = createConsultorFluidaPrompt(diagnosticData);
    console.log('📝 Prompt criado, tamanho:', prompt.length);

    console.log('🌐 Chamando OpenAI...');
    
    // Chamada para OpenAI com timeout de 55 segundos (menor que os 60s do frontend)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55000);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Modelo mais estável e rápido
        messages: [
          { 
            role: 'system', 
            content: getOptimizedSystemPrompt()
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2800,
        stream: false
      }),
    });

    clearTimeout(timeoutId);
    console.log('📡 Status da resposta OpenAI:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', response.status, errorText);
      
      // Fallback conforme especificado no prompt otimizado
      return new Response(JSON.stringify({ 
        diagnostic: 'Diagnóstico temporariamente indisponível. Suas respostas foram salvas com segurança.',
        success: false,
        fallback: true,
        details: `Erro OpenAI: ${response.status}`
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('📄 Resposta OpenAI recebida');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('❌ Estrutura de resposta inválida da OpenAI');
      return new Response(JSON.stringify({ 
        diagnostic: 'Diagnóstico temporariamente indisponível. Suas respostas foram salvas com segurança.',
        success: false,
        fallback: true
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const diagnosticResult = data.choices[0].message.content;
    console.log('✅ Diagnóstico gerado com sucesso, tamanho:', diagnosticResult?.length || 0);

    return new Response(JSON.stringify({ 
      diagnostic: diagnosticResult,
      success: true,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('💥 Erro geral:', error);
    
    if (error.name === 'AbortError') {
      return new Response(JSON.stringify({ 
        diagnostic: 'Diagnóstico temporariamente indisponível. Suas respostas foram salvas com segurança.',
        success: false,
        fallback: true,
        details: 'Timeout - IA demorou mais que 55 segundos para responder'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ 
      diagnostic: 'Diagnóstico temporariamente indisponível. Suas respostas foram salvas com segurança.',
      success: false,
      fallback: true,
      details: error.message 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getOptimizedSystemPrompt(): string {
  return `Você é o CONSULTOR FLUIDA — estrategista oficial da plataforma Fluida para clínicas estéticas e clínicas médicas.

Sua missão é:
1. Entender o tipo de clínica (via dados recebidos)
2. Aplicar o diagnóstico conforme regras e variáveis abaixo
3. Gerar relatório estruturado SEM modificar o fluxo original
4. Garantir que as informações geradas sejam salvas com timestamp no histórico do usuário

📦 Entregáveis (estrutura imutável):
1. Diagnóstico Estratégico da Clínica
2. Sugestões de Conteúdo (Instagram, TikTok, Shorts)
3. Plano de Ação Semanal (4 semanas)
4. Avaliação de Marca e Atendimento
5. Enigma do Mentor
6. Insights Estratégicos Fluida

📊 Diagnóstico Estratégico
- Apontar gargalos
- Verificar desalinhamento entre marca, público e oferta

💡 Sugestões de Conteúdo
- 3 a 5 ideias aplicáveis em Instagram, TikTok ou Shorts
- Incluir sempre pelo menos 1 ideia por equipamento válido

📅 Plano de Ação Semanal
- Baseado em recomendações dos mentores
- Semana 1: Autoridade | 2: Prova Social | 3: Conversão | 4: Aceleração

🎨 Avaliação de Marca
- Comentários sobre logo, atendimento, identidade e programa de indicação

🧩 Enigma do Mentor
- Criar frase divertida sem citar o nome (ex: "O mentor por trás dessa estratégia parece ter vindo do storytelling das estrelas…")

📈 Insights Fluida
- Críticas construtivas (ex: ausência de vídeos, desalinhamento de preço x promessa etc)

⚠️ RESTRIÇÕES:
- Proibido citar live, blog, ebook ou webinar
- Tudo deve caber em conteúdo de rede social
- Use linguagem adaptada: médica = técnico-consultivo, estética = emocional-inspirador
- Não alucine equipamentos ou formatos não citados
- Foque no que foi fornecido nos dados de briefing

🎯 SEGMENTAÇÃO:
- Clínica Médica → Pode ver todos os equipamentos
- Clínica Estética → Apenas equipamentos não invasivos

⚠️ IMPORTANTE: Siga EXATAMENTE a estrutura das 6 seções obrigatórias com os títulos e emojis especificados.`;
}

function createConsultorFluidaPrompt(data: any): string {
  const tipoClinica = data.clinicType === 'clinica_medica' ? 'Médica' : 'Estética';
  const isClinicaMedica = data.clinicType === 'clinica_medica';
  
  // Detectar dados principais com base no tipo de clínica
  const especialidade = isClinicaMedica 
    ? (data.medicalSpecialty || 'Não informado')
    : (data.aestheticFocus || 'Não informado');

  const procedimentos = isClinicaMedica
    ? (data.medicalProcedures || 'Não informado')
    : (data.aestheticTreatments || 'Não informado');

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
  const publicoIdeal = data.targetAudience || 'Não definido';
  const estiloClinica = data.clinicStyle || 'Não definido';
  const desafios = data.mainChallenges || 'Não informado';
  const estiloLinguagem = data.communicationStyle || (isClinicaMedica ? 'técnico-consultivo' : 'emocional e inspirador');

  const prompt = `🎯 CONSULTOR FLUIDA - DIAGNÓSTICO PERSONALIZADO

📋 Dados recebidos (preenchidos pelo usuário):

- Tipo: ${tipoClinica}
- Especialidade: ${especialidade}
- Procedimentos: ${procedimentos}
- Equipamentos: ${equipamentos}
- Protocolo mais vendido: ${protocolo}
- Ticket médio: ${ticketMedio}
- Faturamento atual: ${faturamento}
- Meta 3 meses: ${meta}
- Objetivo: ${objetivo}
- Frequência de conteúdo: ${frequencia}
- Público ideal: ${publicoIdeal}
- Estilo da clínica: ${estiloClinica}
- Estilo de linguagem desejado: ${estiloLinguagem}
- Principais desafios: ${desafios}

🎯 GERE UM DIAGNÓSTICO COMPLETO SEGUINDO A ESTRUTURA OBRIGATÓRIA:

## 📊 Diagnóstico Estratégico da Clínica
[Identifique gargalos, analise desalinhamento entre público/oferta/visual/autoridade, use tom consultivo adaptado]

## 💡 Sugestões de Conteúdo Personalizado
[3-5 ideias práticas SOMENTE para Instagram, Reels, TikTok, Shorts - incluir pelo menos 1 ideia com equipamentos citados]

## 📅 Plano de Ação Semanal
Semana 1: Autoridade e visibilidade
Semana 2: Prova social e diferencial  
Semana 3: Conversão e campanha
Semana 4: Aceleração e fidelização
[3-4 tarefas práticas por semana]

## 🎨 Avaliação de Marca e Atendimento
[Avalie identidade visual, atendimento vs posicionamento, sugira melhorias e programa de indicação]

## 🧩 Enigma do Mentor
[Frase misteriosa com trocadilho - NUNCA revele o nome verdadeiro do mentor]

## 📈 Insights Estratégicos Fluida
[3-5 insights práticos com tom de consultoria]

Use a linguagem adequada:
- ${isClinicaMedica ? 'TÉCNICO-CONSULTIVA (clínica médica)' : 'EMOCIONAL-INSPIRADORA (clínica estética)'}

Foque nos equipamentos mencionados: ${equipamentos}

Personalize tudo com base no perfil fornecido acima.

⚠️ IMPORTANTE: Siga EXATAMENTE a estrutura das 6 seções obrigatórias com os títulos e emojis especificados.`;

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
