
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type AutoIngestBody = {
  course_id: string;
  lesson_id: string;
  title: string;      // e.g., Curso — Aula
  vimeo_url: string;  // Vimeo URL
  language?: string;  // default: pt-BR
};

function extractVimeoId(url: string): string | null {
  const regexes = [
    /vimeo\.com\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/,
    /vimeo\.com\/channels\/[^/]+\/(\d+)/,
    /vimeo\.com\/groups\/[^/]+\/videos\/(\d+)/,
  ];
  for (const r of regexes) {
    const m = url.match(r);
    if (m && m[1]) return m[1];
  }
  return null;
}

async function fetchVttFromVimeo(videoId: string, token: string): Promise<string | null> {
  const listRes = await fetch(`https://api.vimeo.com/videos/${videoId}/texttracks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!listRes.ok) {
    console.error("Vimeo texttracks error:", await listRes.text());
    return null;
  }
  const list = await listRes.json();
  const tracks: any[] = list?.data || [];

  if (!tracks.length) return null;

  // Prefer Portuguese, then English, then first available
  let chosen =
    tracks.find((t) => (t.language || "").toLowerCase().startsWith("pt")) ||
    tracks.find((t) => (t.language || "").toLowerCase().startsWith("en")) ||
    tracks[0];

  const link = chosen?.link;
  if (!link) return null;

  const vttRes = await fetch(link, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!vttRes.ok) {
    console.error("Vimeo VTT download error:", await vttRes.text());
    return null;
  }
  return await vttRes.text();
}

function vttToPlainText(vtt: string): string {
  // Remove cabeçalho WEBVTT e linhas de metadata
  const lines = vtt.split(/\r?\n/);
  const textLines: string[] = [];
  const tsRegex = /^\d{2}:\d{2}:\d{2}\.\d{3}\s+-->\s+\d{2}:\d{2}:\d{2}\.\d{3}/;
  const indexRegex = /^\d+$/;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed === "WEBVTT") continue;
    if (tsRegex.test(trimmed)) continue;
    if (indexRegex.test(trimmed)) continue;
    if (trimmed.startsWith("NOTE")) continue;
    textLines.push(trimmed);
  }
  // De-duplicate simple consecutive repeats
  const compact: string[] = [];
  for (const l of textLines) {
    if (compact.length === 0 || compact[compact.length - 1] !== l) compact.push(l);
  }
  return compact.join("\n");
}

function chunkText(text: string, size = 1500, overlap = 200): { index: number; content: string; tokens: number }[] {
  const chunks: { index: number; content: string; tokens: number }[] = [];
  let i = 0;
  let idx = 0;
  while (i < text.length) {
    const end = Math.min(text.length, i + size);
    const slice = text.slice(i, end);
    const tokens = Math.ceil(slice.length / 4);
    chunks.push({ index: idx++, content: slice, tokens });
    if (end >= text.length) break;
    i = Math.max(0, end - overlap);
  }
  return chunks;
}

async function embedBatch(inputs: string[], apiKey: string): Promise<number[][]> {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: inputs,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI embeddings error: ${await res.text()}`);
  const data = await res.json();
  return data.data.map((d: any) => d.embedding as number[]);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const VIMEO_ACCESS_TOKEN = Deno.env.get("VIMEO_ACCESS_TOKEN");
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY secret in Supabase." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!VIMEO_ACCESS_TOKEN) {
      return new Response(JSON.stringify({ error: "Missing VIMEO_ACCESS_TOKEN secret in Supabase." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as AutoIngestBody;

    if (!body?.course_id || !body?.lesson_id || !body?.title || !body?.vimeo_url) {
      return new Response(JSON.stringify({ error: "Required fields: course_id, lesson_id, title, vimeo_url" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceRoleKey);
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: req.headers.get("Authorization") || "" } },
    });

    // Optionally resolve user for created_by
    const { data: userData } = await userClient.auth.getUser();
    const createdBy = userData?.user?.id || null;

    // Avoid duplicate indexing
    const { data: existing, error: existErr } = await admin
      .from("ai_knowledge_sources")
      .select("id")
      .eq("course_id", body.course_id)
      .eq("lesson_id", body.lesson_id)
      .limit(1)
      .maybeSingle();

    if (existErr) {
      console.error("Check existing source error:", existErr);
    }

    if (existing?.id) {
      return new Response(
        JSON.stringify({ success: true, alreadyIndexed: true, source_id: existing.id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const vimeoId = extractVimeoId(body.vimeo_url);
    if (!vimeoId) {
      return new Response(JSON.stringify({ error: "Invalid Vimeo URL" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const vtt = await fetchVttFromVimeo(vimeoId, VIMEO_ACCESS_TOKEN);
    if (!vtt) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Nenhuma transcrição/legenda encontrada no Vimeo para este vídeo.",
          noTranscript: true,
        }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const plain = vttToPlainText(vtt);
    if (!plain || plain.trim().length < 20) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Transcrição encontrada é muito curta ou inválida.",
          noTranscript: true,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1) Create knowledge source
    const { data: sourceRow, error: srcErr } = await admin
      .from("ai_knowledge_sources")
      .insert({
        source_type: "lesson",
        title: body.title,
        description: null,
        course_id: body.course_id,
        lesson_id: body.lesson_id,
        is_public: false,
        language: body.language || "pt-BR",
        created_by: createdBy,
        metadata: { origin: "vimeo", vimeo_id: vimeoId },
      })
      .select("id")
      .single();

    if (srcErr || !sourceRow) {
      throw new Error(`Failed to create knowledge source: ${srcErr?.message}`);
    }

    const source_id = sourceRow.id as string;

    // 2) Save transcript
    const { error: tErr } = await admin.from("ai_lesson_transcripts").insert({
      source_id,
      language: body.language || "pt-BR",
      full_text: plain,
      segments: null,
      word_count: Math.max(1, plain.trim().split(/\s+/).length),
    });
    if (tErr) throw new Error(`Failed to store transcript: ${tErr.message}`);

    // 3) Chunk & embed
    const chunks = chunkText(plain);
    const embeddings = await embedBatch(chunks.map((c) => c.content), OPENAI_API_KEY);

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
      JSON.stringify({ success: true, source_id, chunks_created: rows.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("auto-ingest-lesson error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
