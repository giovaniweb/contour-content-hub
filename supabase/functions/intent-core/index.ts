
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verificar se temos as configurações necessárias
    if (!openAIApiKey) {
      console.error("OPENAI_API_KEY não configurada");
      return new Response(
        JSON.stringify({ error: 'OPENAI_API_KEY não configurada' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error("Credenciais Supabase não configuradas");
      return new Response(
        JSON.stringify({ error: 'Credenciais Supabase não configuradas' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    let requestData;
    try {
      requestData = await req.json();
      console.log("Dados recebidos:", JSON.stringify(requestData));
    } catch (parseError) {
      console.error("Erro ao processar JSON da requisição:", parseError);
      return new Response(
        JSON.stringify({ error: "Formato de requisição inválido" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { mensagem_usuario, user_id, dados_usuario } = requestData;

    if (!mensagem_usuario) {
      return new Response(
        JSON.stringify({ error: 'mensagem_usuario é obrigatória' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Inicializar cliente Supabase para consulta do perfil do usuário
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    // Obter perfil do usuário para enriquecer contexto, se disponível
    let userProfile = null;
    if (user_id) {
      const { data: profileData, error: profileError } = await supabase
        .from('user_profile')
        .select('*')
        .eq('user_id', user_id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Erro ao buscar perfil:", profileError);
      } else if (profileData) {
        userProfile = profileData;
      }
    }

    // Combinar o contexto do usuário
    const userContext = {
      mensagem_usuario,
      procedimentos: dados_usuario?.procedimentos || [],
      estilo_preferido: userProfile?.estilo_preferido,
      tipos_conteudo_validados: userProfile?.tipos_conteudo_validados,
      foco_comunicacao: userProfile?.foco_comunicacao,
      perfil_comportamental: userProfile?.perfil_comportamental,
      insights_performance: userProfile?.insights_performance
    };

    // Chamar a API do OpenAI para processar a intenção
    console.log("Enviando contexto para processamento:", JSON.stringify(userContext));
    
    const systemPrompt = `
    Você é o Fluida Intelligence Core — o cérebro de um sistema que ajuda profissionais da saúde estética e bem-estar a crescerem através de conteúdo, estratégia, conhecimento e tecnologia.

    Sua função é interpretar a intenção do usuário com base em linguagem natural e histórico comportamental, e então decidir:

    1. Qual é a intenção principal do usuário?
    2. A que área do sistema ela pertence (marketing, ciência, planejamento, vendas, etc.)?
    3. Qual é o direcionamento estratégico principal: venda direta, fortalecimento de marca (branding) ou educação/conexão?
    4. Qual módulo/função deve ser ativado agora?
    5. Qual prompt ideal deve ser executado por esse módulo?
    6. Qual o próximo passo dentro da plataforma Fluida?
    `;

    const userPrompt = `
    Aqui está o contexto recebido:

    Intenção expressa pelo usuário:  
    ${userContext.mensagem_usuario}

    Dados do usuário:  
    - Procedimentos que oferece: ${userContext.procedimentos?.join(', ') || 'Não informado'}  
    - Estilo de conteúdo mais aprovado: ${userContext.estilo_preferido || 'Não informado'}  
    - Tipo de conteúdo que mais consome: ${userContext.tipos_conteudo_validados?.join(', ') || 'Não informado'}  
    - Foco de comunicação: ${userContext.foco_comunicacao || 'Não informado'}  
    - Perfis comportamentais detectados: ${userContext.perfil_comportamental?.join(', ') || 'Não informado'}  
    - Criativos que mais performaram (se houver): ${userContext.insights_performance?.join(', ') || 'Não informado'}  

    Com base nisso, responda no formato JSON conforme a estrutura solicitada.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na API OpenAI:", errorText);
      return new Response(
        JSON.stringify({ error: `Erro na API OpenAI: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const intentResult = JSON.parse(data.choices[0].message.content);
    
    console.log("Resultado da análise de intenção:", JSON.stringify(intentResult));

    // Upsert no perfil do usuário para salvar insights e comportamentos detectados (opcional)
    if (user_id) {
      await supabase
        .from('user_profile')
        .upsert({
          user_id,
          atualizado_em: new Date().toISOString()
        }, { onConflict: 'user_id' });
    }

    return new Response(
      JSON.stringify(intentResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Erro ao processar intenção:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
