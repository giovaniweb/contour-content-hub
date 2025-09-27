import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  token: string;
  newPassword: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token, newPassword }: PasswordResetRequest = await req.json();

    if (!token || !newPassword) {
      return new Response(
        JSON.stringify({ error: "Token e nova senha são obrigatórios" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (newPassword.length < 6) {
      return new Response(
        JSON.stringify({ error: "A senha deve ter pelo menos 6 caracteres" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`[PASSWORD_RESET] Processing password reset with token`);

    // Initialize Supabase client with service role
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Validate and get token data
    const { data: tokenData, error: tokenError } = await supabase
      .from('password_recovery_tokens')
      .select('user_id, email, expires_at, used_at')
      .eq('token', token)
      .single();

    if (tokenError || !tokenData) {
      console.error('[PASSWORD_RESET] Invalid token:', tokenError);
      return new Response(
        JSON.stringify({ error: "Token inválido ou expirado" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Check if token is expired
    if (new Date(tokenData.expires_at) < new Date()) {
      console.error('[PASSWORD_RESET] Token expired');
      return new Response(
        JSON.stringify({ error: "Token expirado" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Check if token was already used
    if (tokenData.used_at) {
      console.error('[PASSWORD_RESET] Token already used');
      return new Response(
        JSON.stringify({ error: "Token já foi utilizado" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`[PASSWORD_RESET] Token valid, updating password for user: ${tokenData.user_id}`);

    // Update user password using admin API
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      tokenData.user_id,
      { password: newPassword }
    );

    if (updateError) {
      console.error('[PASSWORD_RESET] Error updating password:', updateError);
      return new Response(
        JSON.stringify({ error: "Erro ao atualizar senha. Tente novamente." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Mark token as used
    const { error: markUsedError } = await supabase
      .from('password_recovery_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('token', token);

    if (markUsedError) {
      console.error('[PASSWORD_RESET] Error marking token as used:', markUsedError);
      // Don't fail the request for this, password was already updated
    }

    // Clean up expired tokens
    await supabase
      .from('password_recovery_tokens')
      .delete()
      .or(`expires_at.lt.${new Date().toISOString()},used_at.is.not.null`);

    console.log('[PASSWORD_RESET] Password updated successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Senha atualizada com sucesso!"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in process-password-reset function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Erro interno do servidor. Tente novamente em alguns minutos." 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);