
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

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
    // Get document ID and question from request
    const { documentId, question } = await req.json();
    console.log(`Received question request for document ${documentId}: "${question}"`);

    if (!documentId || !question) {
      return new Response(
        JSON.stringify({ error: 'Document ID and question are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get document from database
    const { data: document, error: docError } = await supabase
      .from('documentos_tecnicos')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      console.error('Document not found:', docError);
      return new Response(
        JSON.stringify({ error: 'Document not found', details: docError }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let answer;
    
    // Try to use OpenAI if API key exists
    if (OPENAI_API_KEY) {
      try {
        console.log('Using OpenAI to generate answer');
        
        const systemPrompt = `Você é um assistente especializado em responder perguntas sobre documentos científicos e técnicos.
        
INSTRUÇÕES:
- Responda apenas com informações presentes no documento fornecido
- Se a resposta não estiver no documento, diga isso claramente
- Seja preciso e conciso, mas completo
- Use linguagem clara e acessível
- Cite informações específicas quando relevante

DOCUMENTO:
Título: ${document.titulo}
Descrição: ${document.descricao || 'Não informado'}
Conteúdo: ${document.conteudo_extraido || 'Conteúdo não disponível'}
Palavras-chave: ${document.keywords?.join(', ') || 'Não informado'}
Pesquisadores: ${document.researchers?.join(', ') || 'Não informado'}`;

        // Use OpenAI to answer the question based on the document content
        const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: systemPrompt
              },
              {
                role: 'user',
                content: question
              }
            ],
            temperature: 0.7,
            max_tokens: 1000
          }),
        });

        if (!gptResponse.ok) {
          const errorData = await gptResponse.json();
          console.error('OpenAI API error:', errorData);
          throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
        }

        const gptData = await gptResponse.json();
        answer = gptData.choices[0].message.content;
        
      } catch (openaiError) {
        console.error('Error using OpenAI:', openaiError);
        // Fall back to rule-based answering
        answer = await generateFallbackAnswer(document, question);
      }
    } else {
      // No OpenAI API key, use fallback
      console.log('No OpenAI API key available, using fallback answer generation');
      answer = await generateFallbackAnswer(document, question);
    }

    // Get user ID from JWT token for logging
    const authHeader = req.headers.get('Authorization');
    let userId = null;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser(token);
        if (!userError && userData?.user) {
          userId = userData.user.id;
        }
      } catch (authError) {
        console.warn('Error getting user from token:', authError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        answer,
        sourceDocument: document.titulo
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error answering question:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function generateFallbackAnswer(document: any, question: string): Promise<string> {
  // Enhanced rule-based answer generation based on keywords in the question
  const questionLower = question.toLowerCase();
  const title = document.titulo || '';
  const description = document.descricao || '';
  const content = document.conteudo_extraido || '';
  const keywords = document.keywords || [];
  const researchers = document.researchers || [];
  
  // Combine all available text for search
  const fullText = `${title} ${description} ${content}`.toLowerCase();
  
  if (questionLower.includes('objetivo') || questionLower.includes('purpose') || questionLower.includes('goal')) {
    if (fullText.includes('objetivo') || fullText.includes('purpose')) {
      return `Com base no documento "${title}", o objetivo do estudo está relacionado aos temas abordados no documento. Para uma resposta mais precisa sobre os objetivos específicos, recomendo consultar a seção de introdução ou metodologia do documento completo.`;
    }
    return `O documento "${title}" aborda temas relacionados a ${keywords.join(', ')}. Para obter informações específicas sobre os objetivos do estudo, seria necessário analisar o documento completo.`;
  }
  
  if (questionLower.includes('resultado') || questionLower.includes('result') || questionLower.includes('conclusão') || questionLower.includes('conclusion')) {
    if (fullText.includes('resultado') || fullText.includes('conclus')) {
      return `O documento "${title}" apresenta resultados relacionados aos temas principais do estudo. Para uma análise detalhada dos resultados e conclusões, recomendo consultar as seções específicas do documento.`;
    }
    return `Com base no título e nas palavras-chave (${keywords.join(', ')}), o documento provavelmente apresenta resultados relacionados a esses temas. Para detalhes específicos, consulte o documento completo.`;
  }
  
  if (questionLower.includes('método') || questionLower.includes('metodologia') || questionLower.includes('method') || questionLower.includes('methodology')) {
    return `O estudo "${title}" utiliza metodologias relacionadas aos temas: ${keywords.join(', ')}. Para detalhes específicos sobre a metodologia empregada, consulte a seção de métodos do documento completo.`;
  }
  
  if (questionLower.includes('autor') || questionLower.includes('author') || questionLower.includes('pesquisador') || questionLower.includes('researcher')) {
    if (researchers.length > 0) {
      return `Os pesquisadores/autores deste documento são: ${researchers.join(', ')}.`;
    }
    return `As informações sobre os autores/pesquisadores não estão disponíveis nos metadados do documento. Consulte o documento original para essas informações.`;
  }
  
  if (questionLower.includes('palavra-chave') || questionLower.includes('keyword') || questionLower.includes('tema') || questionLower.includes('topic')) {
    if (keywords.length > 0) {
      return `As principais palavras-chave e temas do documento são: ${keywords.join(', ')}.`;
    }
    return `As palavras-chave específicas não estão disponíveis nos metadados. O documento trata de temas relacionados ao título: "${title}".`;
  }
  
  // Generic response for other questions
  if (content) {
    return `Com base no documento "${title}", posso confirmar que ele aborda temas relacionados a ${keywords.join(', ')}. Para responder sua pergunta específica de forma mais precisa, seria necessário analisar o conteúdo completo do documento. Recomendo consultar o documento original ou reformular sua pergunta focando nos temas principais mencionados.`;
  }
  
  return `O documento "${title}" está disponível para consulta, mas para responder sua pergunta específica, seria necessário ter acesso ao conteúdo completo extraído. Recomendo visualizar o documento PDF diretamente ou entrar em contato com os autores: ${researchers.join(', ') || 'informações de contato não disponíveis'}.`;
}
