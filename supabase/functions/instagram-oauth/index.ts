
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: { autoRefreshToken: false, persistSession: false }
      }
    );

    // O parâmetro 'code' é esperado no body
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "invalid_request", message: "Missing JSON body"}), { status: 400, headers: corsHeaders });
    }

    const { code, action } = body;

    // Só processar se vier action === 'instagram_callback' e code
    if ((action === "instagram_callback" || req.url.endsWith("/auth/instagram")) && code) {
      // Verifica usuário autenticado via Supabase Auth
      const { data: { user }, error: userErr } = await supabaseClient.auth.getUser(req.headers.get('Authorization')?.replace('Bearer ', '') || '');
      if (!user) {
        return new Response(JSON.stringify({ error: "unauthenticated" }), { status: 401, headers: corsHeaders });
      }

      // 1. Troca 'code' por access_token
      const INSTAGRAM_APP_ID = Deno.env.get('INSTAGRAM_CLIENT_ID');
      const INSTAGRAM_APP_SECRET = Deno.env.get('INSTAGRAM_CLIENT_SECRET');
      const REDIRECT_URI = Deno.env.get('INSTAGRAM_REDIRECT_URI') || 'https://fluida.online/auth/instagram';

      if (!INSTAGRAM_APP_ID || !INSTAGRAM_APP_SECRET) {
        return new Response(JSON.stringify({ error: "Missing Instagram app credentials" }), { status: 500, headers: corsHeaders });
      }

      // Troca code pelo access_token do Facebook
      const tokenRes = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: INSTAGRAM_APP_ID,
          client_secret: INSTAGRAM_APP_SECRET,
          redirect_uri: REDIRECT_URI,
          code: code
        }).toString()
      });

      const tokenJson = await tokenRes.json();
      if (!tokenJson.access_token) {
        return new Response(JSON.stringify({ error: "Falha ao obter access_token", details: tokenJson }), { status: 400, headers: corsHeaders });
      }

      const fbAccessToken = tokenJson.access_token;

      // 2. Obter página do usuário e instagram_business_account.id
      const pagesReq = await fetch(`https://graph.facebook.com/v18.0/me/accounts?fields=id,name,instagram_business_account&access_token=${fbAccessToken}`);
      const pagesData = await pagesReq.json();
      if (!pagesData.data || !Array.isArray(pagesData.data) || !pagesData.data.length) {
        return new Response(JSON.stringify({ error: "Nenhuma página conectada ao Facebook Business com Instagram" }), { status: 400, headers: corsHeaders });
      }

      // Procura a primeira página que possua instagram_business_account
      const pageObj = pagesData.data.find((p: any) => !!(p.instagram_business_account && p.instagram_business_account.id));
      if (!pageObj) {
        return new Response(JSON.stringify({ error: "Nenhuma página com conta Instagram Business conectada" }), { status: 400, headers: corsHeaders });
      }

      const page_id = pageObj.id;
      const instagram_id = pageObj.instagram_business_account.id;

      // 3. Busca nome do perfil Instagram (usando Graph API)
      const igProfileResp = await fetch(`https://graph.facebook.com/v18.0/${instagram_id}?fields=username&access_token=${fbAccessToken}`);
      const igProfileData = await igProfileResp.json();
      if (!igProfileData.username) {
        return new Response(JSON.stringify({ error: "Falha ao buscar nome do perfil Instagram", details: igProfileData }), { status: 400, headers: corsHeaders });
      }

      const username = igProfileData.username;

      // 4. Upsert na tabela instagram_accounts (apenas 1 registro por user_id)
      const { error: saveError } = await supabaseClient.from('instagram_accounts').upsert({
        user_id: user.id,
        access_token: fbAccessToken,
        instagram_id,
        page_id,
        username,
        connected_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
      if (saveError) {
        return new Response(JSON.stringify({ error: saveError.message }), { status: 500, headers: corsHeaders });
      }

      return new Response(JSON.stringify({
        success: true,
        instagram_id,
        page_id,
        username,
        connected_at: new Date().toISOString()
      }), { status: 200, headers: corsHeaders });
    }

    // Request inválida
    return new Response(JSON.stringify({ error: "invalid_request" }), { status: 400, headers: corsHeaders });
  } catch (err) {
    console.error("Instagram OAuth edge error:", err);
    return new Response(JSON.stringify({ error: "server_error", details: String(err) }), { status: 500, headers: corsHeaders });
  }
});
