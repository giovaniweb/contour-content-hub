import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface IngestBody {
  source: {
    source_type?: string;
    title: string;
    description?: string;
    course_id?: string | null;
    lesson_id?: string | null;
    language?: string | null;
    is_public?: boolean;
  };
  transcript?: string;       // full transcript text
  text?: string;              // alternative raw text (articles, docs)
  segments?: Array<{ start?: number; end?: number; text: string }>; // optional timed segments
}

function chunkText(text: string, size = 1500, overlap = 200): { index: number; content: string; tokens: number }[] {
  const chunks: { index: number; content: string; tokens: number }[] = [];
  let i = 0; let idx = 0;
  while (i < text.length) {
    const end = Math.min(text.length, i + size);
    const slice = text.slice(i, end);
    const tokens = Math.ceil(slice.length / 4); // rough estimate for pt-BR
    chunks.push({ index: idx++, content: slice, tokens });
    if (end >= text.length) break;
    i = end - overlap; // overlap
    if (i < 0) i = 0;
  }
  return chunks;
}

async function embedBatch(inputs: string[], apiKey: string): Promise<number[][]> {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: inputs,
    }),
  });
  if (!res.ok) {
    throw new Error(`OpenAI embeddings error: ${await res.text()}`);
  }
  const data = await res.json();
  return data.data.map((d: any) => d.embedding as number[]);
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

    const body = (await req.json()) as IngestBody;
    const content = body.transcript || body.text;
    if (!content || !body.source?.title) {
      return new Response(JSON.stringify({ error: "Required fields: source.title and transcript/text" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    // Admin client for inserts
    const admin = createClient(supabaseUrl, supabaseServiceRole);

    // Try to resolve user for created_by (using caller JWT if present)
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: req.headers.get("Authorization") || "" } },
    });
    const { data: userData } = await userClient.auth.getUser();

    // 1) Create knowledge source
    const { data: sourceRow, error: sourceErr } = await admin
      .from("ai_knowledge_sources")
      .insert({
        source_type: body.source.source_type || "lesson",
        title: body.source.title,
        description: body.source.description || null,
        course_id: body.source.course_id || null,
        lesson_id: body.source.lesson_id || null,
        is_public: body.source.is_public ?? false,
        language: body.source.language || null,
        created_by: userData?.user?.id || null,
        metadata: {},
      })
      .select("id")
      .single();

    if (sourceErr || !sourceRow) {
      throw new Error(`Failed to create knowledge source: ${sourceErr?.message}`);
    }

    const source_id = sourceRow.id as string;

    // 2) Save transcript if provided
    if (body.transcript) {
      const { error: tErr } = await admin.from("ai_lesson_transcripts").insert({
        source_id,
        language: body.source.language || null,
        full_text: body.transcript,
        segments: body.segments || null,
        word_count: Math.max(1, body.transcript.trim().split(/\s+/).length),
      });
      if (tErr) throw new Error(`Failed to store transcript: ${tErr.message}`);
    }

    // 3) Chunk & embed
    const chunks = chunkText(content);
    const embeddings = await embedBatch(chunks.map(c => c.content), OPENAI_API_KEY);

    const rows = chunks.map((c, i) => ({
      source_id,
      chunk_index: c.index,
      content: c.content,
      tokens: c.tokens,
      embedding: embeddings[i],
      metadata: {},
    }));

    const { error: cErr } = await admin.from("ai_knowledge_chunks").insert(rows);
    if (cErr) throw new Error(`Failed to insert chunks: ${cErr.message}`);

    return new Response(
      JSON.stringify({
        success: true,
        source_id,
        chunks_created: rows.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("ingest-knowledge error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
