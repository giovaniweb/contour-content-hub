import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AdminUserSyncRequest {
  action: 'syncEmail' | 'updateUserData' | 'checkGiovanni';
  userId?: string;
  email?: string;
  userData?: Record<string, any>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, userId, email, userData }: AdminUserSyncRequest = await req.json();

    console.log(`[ADMIN] Processing action: ${action}`);

    switch (action) {
      case 'syncEmail': {
        if (!userId || !email) {
          return new Response(
            JSON.stringify({ success: false, error: 'userId and email required' }),
            { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          );
        }

        // Update profile email
        const { error: profileError } = await supabase
          .from('perfis')
          .update({ email: email })
          .eq('id', userId);

        if (profileError) {
          throw new Error(`Profile update error: ${profileError.message}`);
        }

        // Update auth email via Admin API
        const { error: authError } = await supabase.auth.admin.updateUserById(
          userId,
          { email: email }
        );

        const response = {
          success: !authError,
          profileUpdated: !profileError,
          authUpdated: !authError,
          message: authError 
            ? `Profile updated successfully. Auth error: ${authError.message}` 
            : 'Email synchronized successfully in both profile and auth',
          partialSuccess: !profileError && !!authError
        };

        return new Response(
          JSON.stringify(response),
          { status: authError ? 207 : 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      case 'updateUserData': {
        if (!userId || !userData) {
          return new Response(
            JSON.stringify({ success: false, error: 'userId and userData required' }),
            { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          );
        }

        // Update profile with provided data
        const { error: profileError } = await supabase
          .from('perfis')
          .update(userData)
          .eq('id', userId);

        if (profileError) {
          throw new Error(`Profile update error: ${profileError.message}`);
        }

        // Send welcome email if this is a new user creation by admin
        if (userData.email && userData.nome) {
          try {
            const { error: emailError } = await supabase.functions.invoke('send-signup-confirmation', {
              body: {
                email: userData.email,
                name: userData.nome,
                userId: userId
              }
            });

            if (emailError) {
              console.error('Welcome email error:', emailError);
            } else {
              console.log('Welcome email sent successfully');
            }
          } catch (emailErr) {
            console.error('Failed to send welcome email:', emailErr);
          }
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: 'User data updated successfully',
            profileUpdated: true
          }),
          { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      case 'checkGiovanni': {
        const { data: user, error } = await supabase
          .from('perfis')
          .select('id, email, nome')
          .eq('email', 'giovani@contourline.com.br')
          .single();

        if (error || !user) {
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Giovanni user not found'
            }),
            { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Giovanni found',
            user_id: user.id,
            current_email: user.email,
            name: user.nome
          }),
          { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid action' }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
    }

  } catch (error: any) {
    console.error('Admin user management error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};

serve(handler);