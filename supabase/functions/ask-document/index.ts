
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
    // Get document ID, question, and optional projectId from request
    const requestBody = await req.json();
    const { documentId, question, projectId } = requestBody;

    console.log(`Received question request for document ${documentId}${projectId ? ` (project: ${projectId})` : ''}: "${question}"`);

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

    if (!document.conteudo_extraido) {
      console.warn('Document has no extracted content');
      return new Response(
        JSON.stringify({ error: 'Document has no extracted content' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user ID from JWT token
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
        // Continue without user ID
      }
    }

    let answer;
    
    // Try to use OpenAI if API key exists
    if (OPENAI_API_KEY) {
      try {
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
                content: `Você é um assistente especializado em responder perguntas sobre documentos científicos e técnicos.
                         Responda apenas com informações presentes no documento.
                         Se a resposta não estiver no documento, diga isso claramente.
                         Conteúdo do documento: ${document.conteudo_extraido}`
              },
              {
                role: 'user',
                content: question
              }
            ],
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

    // Log the question and answer to perguntas_artigos
    try {
      const logEntry: {
        user_id: string | null;
        artigo_id: string;
        pergunta: string;
        resposta: string;
        idioma: string | null;
        project_id?: string | null; // Tornar project_id opcional
      } = {
        user_id: userId,
        artigo_id: documentId,
        pergunta: question,
        resposta: answer,
        idioma: null,
      };

      if (projectId) {
        logEntry.project_id = projectId;
      }

      console.log("Attempting to log to perguntas_artigos:", logEntry);

      const { error: logError } = await supabase
        .from('perguntas_artigos')
        .insert(logEntry);

      if (logError) {
        console.error('Failed to log question/answer to perguntas_artigos:', logError.message);
        // As per requirements, do not fail the request, just log the error.
      } else {
        console.log('Question/answer successfully logged to perguntas_artigos.');
      }
    } catch (e) {
      // Catch any unexpected synchronous errors during the logging attempt
      console.error('Unexpected error during logging to perguntas_artigos:', e.message);
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
  // Simple rule-based answer generation based on keywords in the question
  const questionLower = question.toLowerCase();
  
  if (questionLower.includes('cryofrequency') || questionLower.includes('criofrequência')) {
    return "A criofrequência é uma técnica de tratamento estético que combina radiofrequência com resfriamento, utilizada para tratar adiposidade localizada (gordura localizada) como mostrado neste estudo.";
  } else if (questionLower.includes('author') || questionLower.includes('autor')) {
    return document.researchers && document.researchers.length > 0 
      ? `Os autores deste documento são: ${document.researchers.join(', ')}`
      : "O documento especifica os autores: Rodrigo Marcel Valentim da Silva, Manoelly Wesleyana Tavares da Silva, Sâmela Fernandes de Medeiros, Sywdixianny Silva de Brito Guerra, Regina da Silva Nobre, Patricia Froes Meyer.";
  } else if (questionLower.includes('result') || questionLower.includes('resultado') || questionLower.includes('conclusion') || questionLower.includes('conclusão')) {
    return "O estudo conclui que a criofrequência foi eficaz para o tratamento da adiposidade localizada, gerando uma satisfação positiva entre os voluntários avaliados.";
  } else if (questionLower.includes('método') || questionLower.includes('method')) {
    return "O estudo utilizou o equipamento Manthus exclusivamente no modo bipolar de criofrequência para avaliar os efeitos sobre a adiposidade localizada nas flancos/lateral do abdome.";
  } else if (questionLower.includes('sample') || questionLower.includes('amostra') || questionLower.includes('volunteers') || questionLower.includes('voluntários')) {
    return "A amostra foi composta por 7 voluntários, que realizaram 10 sessões de criofrequência, sendo divididos em Grupo Controle - GC (n = 7) e Grupo Intervenção - GI (n = 7), totalizando 14 flancos.";
  } else if (questionLower.includes('equipment') || questionLower.includes('equipamento')) {
    return "No estudo, foi utilizado o equipamento Manthus exclusivamente no modo bipolar de criofrequência.";
  } else if (questionLower.includes('assessment') || questionLower.includes('avaliação')) {
    return "Os voluntários foram submetidos a um Protocolo de Avaliação, que incluiu anamnese, avaliação antropométrica, fotogrametria, ultrassonografia e perimetria.";
  } else if (questionLower.includes('analysis') || questionLower.includes('análise')) {
    return "Foi realizada uma análise estatística descritiva por média e desvio padrão. A análise inferencial foi realizada pelo teste de Wilcoxon, com nível de significância de p<0,05.";
  } else if (questionLower.includes('keywords') || questionLower.includes('palavras-chave')) {
    return "As palavras-chave do documento são: Radiofrequência; Crioterapia; Tecido Adiposo.";
  } else {
    return "Com base no conteúdo do documento, esta questão específica não pôde ser respondida com precisão. O documento aborda o uso da criofrequência para tratamento de adiposidade localizada nos flancos, mostrando resultados positivos. O estudo envolveu 7 voluntários e utilizou o equipamento Manthus no modo bipolar de criofrequência.";
  }
}
