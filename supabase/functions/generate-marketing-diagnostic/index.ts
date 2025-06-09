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
        details: 'A chave da OpenAI precisa ser configurada nos secrets do Supabase'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!openAIApiKey.startsWith('sk-')) {
      console.error('❌ OPENAI_API_KEY inválida - deve começar com sk-');
      return new Response(JSON.stringify({ 
        error: 'Chave OpenAI inválida - deve começar com sk-',
        success: false,
        details: 'Verifique se a chave da OpenAI foi configurada corretamente'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Criar prompt seguindo as especificações completas
    const prompt = createConsultorFluidaPrompt(diagnosticData);
    console.log('📝 Prompt criado, tamanho:', prompt.length);

    console.log('🌐 Testando conexão com OpenAI...');
    
    // Teste da chave OpenAI
    const testResponse = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('🔍 Teste de conexão OpenAI status:', testResponse.status);
    
    if (!testResponse.ok) {
      const testError = await testResponse.text();
      console.error('❌ Falha no teste da chave OpenAI:', testError);
      return new Response(JSON.stringify({ 
        error: 'Chave OpenAI inválida ou sem permissão',
        success: false,
        details: `Status: ${testResponse.status} - ${testError}`
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ Chave OpenAI válida, gerando diagnóstico...');
    
    // Chamada para OpenAI com timeout de 60 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14', // Modelo mais recente e potente
        messages: [
          { 
            role: 'system', 
            content: getSystemPrompt()
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000 // Aumentado para diagnósticos mais completos
      }),
    });

    clearTimeout(timeoutId);
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
    
    if (error.name === 'AbortError') {
      return new Response(JSON.stringify({ 
        error: 'Timeout - IA demorou mais que 60 segundos para responder',
        success: false,
        details: 'Tente novamente em alguns minutos'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
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

function getSystemPrompt(): string {
  return `Você é o CONSULTOR FLUIDA — estrategista oficial da plataforma para clínicas estéticas e médicas.

Sua missão é gerar um diagnóstico completo com base nas respostas fornecidas, adaptando a linguagem e recomendações ao tipo de clínica (médica ou estética).

📦 ESTRUTURA OBRIGATÓRIA DO RESULTADO:

## 📊 Diagnóstico Estratégico da Clínica
[Identifique gargalos, analise desalinhamento entre público/oferta/visual/autoridade, use tom consultivo adaptado]

## 💡 Sugestões de Conteúdo Personalizado
[3-5 ideias práticas SOMENTE para Instagram, Reels, TikTok, Shorts - incluir pelo menos 3 ideias com equipamentos citados]

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

⚠️ RESTRIÇÕES:
- Proibido citar live, blog, ebook ou webinar
- Tudo deve caber em conteúdo de rede social
- Use linguagem adaptada: médica = técnico-consultivo, estética = emocional-inspirador
- Não alucine equipamentos ou formatos não citados
- Foque no que foi fornecido nos dados de briefing

🎯 SEGMENTAÇÃO:
- Clínica Médica → Pode ver todos os equipamentos
- Clínica Estética → Apenas equipamentos não invasivos
- Inferência: Unyque PRO/Reverso/Enygma = MÉDICA | Crystal 3D Plus/Crio/Multishape = ESTÉTICA

⚠️ VALIDAÇÃO DE EQUIPAMENTOS:
Todo equipamento citado deve ser validado com base no banco oficial. Se não reconhecido, gere alerta:
"Equipamento não validado no banco de dados oficial. Verifique a ortografia ou consulte o time técnico Fluida."

Se múltiplos equipamentos, gere pelo menos 1 sugestão de conteúdo e 1 insight para cada um.`;
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

  // Detectar se aparece nos vídeos
  const apareceVideos = data.showsInVideos ? 'Sim' : 'Não definido';

  // Problemas que os equipamentos resolvem
  const problemasEquipamentos = data.equipmentProblems || 'Não informado';

  // Modelo de venda
  const modeloVenda = data.salesModel || 'Não informado';

  const prompt = `🎯 CONSULTOR FLUIDA - DIAGNÓSTICO PERSONALIZADO

📋 DADOS DE BRIEFING:

• Tipo: ${tipoClinica}
• Especialidade: ${especialidade}
• Procedimentos: ${procedimentos}
• Equipamentos: ${equipamentos}
• Problemas que os equipamentos resolvem: ${problemasEquipamentos}
• Protocolo mais vendido: ${protocolo}
• Ticket médio: ${ticketMedio}
• Modelo de venda: ${modeloVenda}
• Faturamento atual: ${faturamento}
• Meta 3 meses: ${meta}
• Objetivo de marketing: ${objetivo}
• Frequência de conteúdo: ${frequencia}
• Aparece nos vídeos: ${apareceVideos}
• Público ideal: ${publicoIdeal}
• Estilo da clínica: ${estiloClinica}
• Estilo de linguagem desejado: ${estiloLinguagem}
• Principais desafios: ${desafios}

---

🎯 GERE UM DIAGNÓSTICO COMPLETO SEGUINDO A ESTRUTURA OBRIGATÓRIA:

Use a linguagem adequada:
- ${isClinicaMedica ? 'TÉCNICO-CONSULTIVA (clínica médica)' : 'EMOCIONAL-INSPIRADORA (clínica estética)'}

Foque nos equipamentos mencionados: ${equipamentos}

Personalize tudo com base no perfil fornecido acima.

⚠️ IMPORTANTE: Siga EXATAMENTE a estrutura das 6 seções obrigatórias com os títulos e emojis especificados.

Se houver múltiplos equipamentos, gere pelo menos 1 sugestão de conteúdo e 1 insight para cada um.

O plano deve ser dinâmico e alinhado com as recomendações, personalizando linguagem e abordagem.

Para o Enigma do Mentor, crie uma frase misteriosa com trocadilho, mas NUNCA revele o nome verdadeiro do mentor.`;

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
