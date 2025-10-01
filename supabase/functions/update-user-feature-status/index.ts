import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UpdateStatusRequest {
  userId: string;
  feature: string;
  status: 'blocked' | 'coming_soon' | 'beta' | 'released' | null;
  reason?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verificar se o usuário é admin
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Não autenticado');
    }

    const { data: profile, error: profileError } = await supabaseClient
      .from('perfis')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || !['admin', 'superadmin'].includes(profile.role)) {
      return new Response(
        JSON.stringify({ error: 'Acesso negado. Apenas administradores podem alterar status de features.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { userId, feature, status, reason }: UpdateStatusRequest = await req.json();

    console.log('[UPDATE STATUS] Request:', { userId, feature, status, reason });

    // Buscar status atual
    const { data: currentPermission, error: fetchError } = await supabaseClient
      .from('user_feature_permissions')
      .select('user_override_status, status')
      .eq('user_id', userId)
      .eq('feature', feature)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    const oldStatus = currentPermission?.user_override_status || currentPermission?.status || null;

    // Atualizar ou criar permissão com novo status
    const { error: updateError } = await supabaseClient
      .from('user_feature_permissions')
      .upsert({
        user_id: userId,
        feature: feature,
        user_override_status: status,
        enabled: true, // Mantém habilitado para compatibilidade
      }, {
        onConflict: 'user_id,feature'
      });

    if (updateError) {
      throw updateError;
    }

    // Registrar no histórico
    const { error: historyError } = await supabaseClient
      .from('user_feature_status_history')
      .insert({
        user_id: userId,
        feature: feature,
        old_status: oldStatus,
        new_status: status,
        changed_by: user.id,
        change_reason: reason || null
      });

    if (historyError) {
      console.error('[UPDATE STATUS] Error logging history:', historyError);
    }

    console.log('[UPDATE STATUS] Success:', { userId, feature, oldStatus, newStatus: status });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Status atualizado com sucesso',
        data: {
          userId,
          feature,
          oldStatus,
          newStatus: status,
          isOverride: status !== null
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[UPDATE STATUS] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
