
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY não encontrado');
    }

    console.log("Edge function iniciada");
    
    // Parse request
    const requestData = await req.json();
    console.log("Dados recebidos:", JSON.stringify(requestData));
    
    const { request } = requestData;
    if (!request) {
      throw new Error('Formato de requisição inválido: "request" não encontrado');
    }
    
    const { type, topic, equipment, bodyArea, purpose, additionalInfo, tone, language } = request;
    
    console.log(`Processando requisição para tipo: ${type}, tópico: ${topic}`);

    // Create system prompt based on script type
    let systemPrompt = "";
    let userPrompt = "";

    const lang = language === "PT" ? "português" : "inglês";
    const toneText = tone === "professional" ? "profissional" 
                   : tone === "friendly" ? "descontraído"
                   : tone === "provocative" ? "provocativo"
                   : tone === "educational" ? "educativo" 
                   : "profissional";

    switch (type) {
      case "videoScript":
        systemPrompt = `Você é um especialista em marketing para clínicas estéticas. Sua tarefa é criar roteiros detalhados para vídeos educativos sobre tratamentos estéticos.`;
        userPrompt = `Crie um roteiro completo para um vídeo sobre ${topic || "tratamento estético"} em ${lang} com um tom ${toneText}.
          ${equipment?.length ? `O vídeo deve destacar o uso dos seguintes equipamentos: ${equipment.join(", ")}.` : ""}
          ${bodyArea ? `O tratamento é focado na área: ${bodyArea}.` : ""}
          ${purpose ? `O propósito do tratamento é: ${purpose}.` : ""}
          ${additionalInfo ? `Informações adicionais: ${additionalInfo}` : ""}
          
          O roteiro deve incluir:
          1. Uma introdução cativante (10-15 segundos)
          2. Explicação do tratamento (30-45 segundos)
          3. Benefícios e resultados esperados (20-30 segundos)
          4. Dicas e cuidados (15-20 segundos)
          5. Chamada para ação (5-10 segundos)
          
          Formate o roteiro em Markdown com cabeçalhos para cada seção.`;
        break;
      case "bigIdea":
        systemPrompt = `Você é um estrategista de marketing especializado em criar campanhas impactantes para clínicas estéticas.`;
        userPrompt = `Desenvolva uma agenda criativa completa para uma campanha sobre ${topic || "tratamento estético"} em ${lang} com um tom ${toneText}.
          ${equipment?.length ? `A campanha deve destacar os seguintes equipamentos: ${equipment.join(", ")}.` : ""}
          ${bodyArea ? `O foco da campanha é na área: ${bodyArea}.` : ""}
          ${purpose ? `O propósito desta campanha é: ${purpose}.` : ""}
          ${additionalInfo ? `Considerações adicionais: ${additionalInfo}` : ""}
          
          A agenda deve incluir:
          1. Conceito principal da campanha
          2. Pontos-chave de mensagem (mínimo 3)
          3. Estratégia de conteúdo para redes sociais
          4. Sugestões de temas para posts semanais
          
          Formate a agenda em Markdown com seções bem definidas.`;
        break;
      case "dailySales":
        systemPrompt = `Você é um especialista em copy para redes sociais de clínicas estéticas, especializado em stories que geram conversões.`;
        userPrompt = `Crie um texto curto e persuasivo para stories sobre ${topic || "tratamento estético"} em ${lang} com um tom ${toneText}.
          ${equipment?.length ? `Mencione os seguintes equipamentos: ${equipment.join(", ")}.` : ""}
          ${bodyArea ? `O foco do story é na área: ${bodyArea}.` : ""}
          ${purpose ? `O propósito desta promoção é: ${purpose}.` : ""}
          ${additionalInfo ? `Considerações adicionais: ${additionalInfo}` : ""}
          
          O texto deve:
          1. Capturar a atenção nos primeiros 5-7 segundos
          2. Destacar um benefício exclusivo
          3. Criar senso de urgência
          4. Terminar com uma chamada para ação clara
          
          Limite o texto a no máximo 280 caracteres para que seja eficaz em stories.`;
        break;
      default:
        throw new Error(`Tipo de roteiro inválido: ${type}`);
    }

    console.log("Enviando requisição para OpenAI");
    
    // Call OpenAI API
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
        temperature: 0.7
      })
    });

    // Get response from OpenAI
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na API OpenAI:", errorText);
      throw new Error(`Erro na API OpenAI: Status ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      console.error("Erro retornado pela API OpenAI:", data.error);
      throw new Error(`Erro na API OpenAI: ${data.error.message}`);
    }

    const content = data.choices[0].message.content;
    console.log("Conteúdo gerado com sucesso");
    
    // Generate title based on content
    let title = "";
    const firstLine = content.split('\n')[0].replace(/^#\s+/, '');
    title = firstLine.length > 5 ? firstLine.slice(0, 50) : (topic || "Novo roteiro");

    // Generate suggested videos and other content
    const scriptId = `script-${Date.now()}`;
    
    // Create script response
    const scriptResponse = {
      id: scriptId,
      content,
      title,
      type,
      createdAt: new Date().toISOString(),
      suggestedVideos: [
        {
          id: "video-1",
          title: "Before/After Results",
          thumbnailUrl: "/placeholder.svg",
          duration: "0:45",
          type: "video",
          equipment: equipment || ["UltraSonic"],
          bodyArea: bodyArea ? [bodyArea] : ["Face"],
          purpose: purpose ? [purpose] : ["Content creation"],
          rating: 4.5,
          isFavorite: false
        },
        {
          id: "video-2",
          title: "Treatment Process",
          thumbnailUrl: "/placeholder.svg",
          duration: "1:20",
          type: "video",
          equipment: equipment || ["Venus Freeze"],
          bodyArea: bodyArea ? [bodyArea] : ["Abdomen"],
          purpose: purpose ? [purpose] : ["Education"],
          rating: 4.7,
          isFavorite: false
        }
      ],
      suggestedMusic: [
        {
          id: "music-1",
          title: "Upbeat Corporate",
          artist: "Audio Library",
          url: "/music/upbeat-corporate.mp3"
        },
        {
          id: "music-2",
          title: "Gentle Ambient",
          artist: "Sound Collection",
          url: "/music/gentle-ambient.mp3"
        }
      ],
      suggestedFonts: [
        {
          name: "Helvetica Neue",
          style: "Sans-serif"
        },
        {
          name: "Montserrat",
          style: "Sans-serif"
        }
      ],
      captionTips: [
        "Mantenha as legendas curtas e objetivas",
        "Use emojis estrategicamente",
        "Inclua uma chamada para ação"
      ]
    };

    // Save to database if authenticated
    try {
      const authHeader = req.headers.get('Authorization');
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        const supabaseAdmin = createClient(
          Deno.env.get('SUPABASE_URL') || '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
        );
        
        // Get user from JWT
        const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
        
        if (userError) {
          console.error('Erro ao obter usuário:', userError);
        } else if (userData.user) {
          // Save script to database
          const { error } = await supabaseAdmin
            .from('roteiros')
            .insert({
              usuario_id: userData.user.id,
              tipo: type,
              titulo: title,
              conteudo: content,
              status: 'gerado'
            });
            
          if (error) {
            console.error('Erro ao salvar roteiro:', error);
          } else {
            console.log('Roteiro salvo com sucesso no banco de dados');
          }
        }
      }
    } catch (dbError) {
      console.error('Erro ao salvar no banco:', dbError);
      // Continue even if db save fails
    }

    console.log("Enviando resposta para o cliente");
    
    // Return the response
    return new Response(JSON.stringify(scriptResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-script function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
