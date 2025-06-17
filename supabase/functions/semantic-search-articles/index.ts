import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

console.log("Semantic Search Articles Function Initializing");

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Use service role key for admin-level access
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const requestBody = await req.json();
    console.log("Request body received:", requestBody);

    const query_embedding = requestBody.query_embedding;
    const match_count = requestBody.match_count || 5;
    const match_threshold = requestBody.match_threshold || 0.7;
    const article_type = requestBody.article_type || 'artigo_cientifico';
    const project_id = requestBody.project_id || null; // Novo: obter project_id, default para null se não fornecido

    if (!query_embedding || !Array.isArray(query_embedding)) {
      console.error("Validation error: query_embedding is required and must be an array.");
      return new Response(JSON.stringify({ error: 'query_embedding is required and must be an array' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Calling RPC 'match_documents' with: count=${match_count}, threshold=${match_threshold}, type=${article_type}, project_id=${project_id}`);

    const rpcParams: {
      p_query_embedding: number[];
      p_match_threshold: number;
      p_match_count: number;
      p_article_type: string;
      p_project_id?: string | null; // Definido como opcional na função SQL com DEFAULT NULL
    } = {
      p_query_embedding: query_embedding,
      p_match_threshold: match_threshold,
      p_match_count: match_count,
      p_article_type: article_type,
    };

    if (project_id) {
      rpcParams.p_project_id = project_id;
    }
    // Se project_id for null, p_project_id não será adicionado ao rpcParams,
    // e a função SQL usará seu valor DEFAULT NULL.

    const { data, error } = await supabaseClient.rpc('match_documents', rpcParams);

    if (error) {
      console.error("Error calling RPC 'match_documents':", error);
      return new Response(JSON.stringify({ error: error.message, details: error.details || error.hint || '' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log("'match_documents' RPC call successful. Data:", data);
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (e) {
    const error = e as Error;
    console.error("Unhandled error in Edge Function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
