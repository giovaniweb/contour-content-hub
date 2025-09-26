import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PasswordRecoveryRequest {
  email: string;
  redirectTo?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, redirectTo = "https://fluida.online/reset-password" }: PasswordRecoveryRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email é obrigatório" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log(`[AUTH] Processing password recovery for: ${email}`);

    // Use Supabase's built-in password recovery that handles email sending
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo
    });

    if (error) {
      console.error("[AUTH] Error sending recovery email:", error);
      
      // Check if error is because user doesn't exist
      if (error.message?.includes('User not found') || error.message?.includes('Unable to get user') || error.code === 'user_not_found') {
        console.log(`[AUTH] User not found for email: ${email} - Error: ${error.message}`);
      }
      
      // Always return success for security (don't reveal if email exists)
      return new Response(
        JSON.stringify({ 
          message: "Se o email existir em nossa base de dados, você receberá instruções para redefinir sua senha.",
          success: true
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Password recovery email sent successfully via Supabase");

    return new Response(
      JSON.stringify({ 
        message: "Se o email existir em nossa base de dados, você receberá instruções para redefinir sua senha.",
        success: true
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-password-recovery function:", error);
    
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