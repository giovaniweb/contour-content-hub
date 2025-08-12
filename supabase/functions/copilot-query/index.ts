import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QueryBody {
  query: string;
  top_k?: number;
  course_id?: string | null;
  lesson_id?: string | null;
  session_id?: string | null;
}

async function embedQuery(input: string, apiKey: string): Promise<number[]> {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: "text-embedding-3-small", input }),
  });
  if (!res.ok) throw new Error(`OpenAI embeddings error: ${await res.text()}`);
  const data = await res.json();
  return data.data[0].embedding as number[];
}

async function chatAnswer(prompt: string, apiKey: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Você é o assistente Fluida Academy. Responda em português, de forma objetiva, usando SOMENTE o contexto fornecido. Sempre cite as fontes pelo número (Fonte 1, 2, ...) e inclua timestamps quando disponíveis." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
      }),
  });
  if (!res.ok) throw new Error(`OpenAI chat error: ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY secret in Supabase." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as QueryBody;
    if (!body.query) {
      return new Response(JSON.stringify({ error: "Missing query" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

    // Use caller's JWT so RLS enforces course access automatically
    const client = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: req.headers.get("Authorization") || "" } },
    });

    // 1) Embed query
    const queryEmbedding = await embedQuery(body.query, OPENAI_API_KEY);

    // 2) Semantic search via RPC
    const { data: matches, error: mErr } = await client.rpc("search_knowledge_chunks", {
      p_embedding: queryEmbedding as unknown as any,
      p_match_count: body.top_k ?? 6,
      p_course_id: body.course_id ?? null,
      p_lesson_id: body.lesson_id ?? null,
    });
    if (mErr) throw new Error(`Search error: ${mErr.message}`);

    const top = (matches || []).slice(0, body.top_k ?? 6);
    const context = top
      .map((m: any, i: number) => `Fonte ${i + 1} | ${m.title} (score ${(m.score ?? 0).toFixed(3)}):\n${m.content}`)
      .join("\n\n");

    const prompt = `Contexto confiável (use apenas o que está abaixo):\n\n${context}\n\nPergunta: ${body.query}\n\nResponda citando as fontes pelo número (Fonte 1, 2, ...).`;

    // 3) Generate answer
    const answer = await chatAnswer(prompt, OPENAI_API_KEY);

    // 4) Optionally persist chat message in user's session
    if (body.session_id) {
      const { data: userData } = await client.auth.getUser();
      if (userData?.user) {
        // Store user question and assistant answer
        await client.from("copilot_messages").insert([
          { session_id: body.session_id, role: "user", content: body.query },
          { session_id: body.session_id, role: "assistant", content: answer, citations: top },
        ]);
      }
    }

    return new Response(
      JSON.stringify({
        answer,
        citations: top,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("copilot-query error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
