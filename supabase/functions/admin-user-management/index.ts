import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

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
    console.log('🔧 Admin User Management - Starting request');
    
    // Create admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get user from authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('❌ Missing or invalid authorization header');
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      console.error('❌ Invalid token:', userError);
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Verify user is admin
    const { data: adminProfile } = await supabaseAdmin
      .from('perfis')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!adminProfile || !['admin', 'superadmin'].includes(adminProfile.role)) {
      console.error('❌ User is not admin');
      return new Response(
        JSON.stringify({ error: 'Access denied. Admin role required.' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { action, userId, email, userData } = await req.json();
    console.log(`🎯 Action: ${action} for user: ${userId}`);

    switch (action) {
      case 'syncEmail': {
        if (!userId || !email) {
          return new Response(
            JSON.stringify({ error: 'userId and email are required' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        // Check if email already exists in auth.users (excluding current user)
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
        const emailExists = existingUsers.users?.find(u => 
          u.email?.toLowerCase() === email.toLowerCase() && u.id !== userId
        );

        if (emailExists) {
          console.error('❌ Email already exists in auth.users:', email);
          return new Response(
            JSON.stringify({ 
              error: `Este email já está em uso por outro usuário (ID: ${emailExists.id})`,
              success: false 
            }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        console.log(`📧 Syncing email for user ${userId} to ${email}`);

        // Call database function to update perfis table
        const { data: syncResult, error: syncError } = await supabaseAdmin
          .rpc('sync_user_email', {
            user_id_param: userId,
            new_email: email
          });

        if (syncError) {
          console.error('❌ Sync function error:', syncError);
          return new Response(
            JSON.stringify({ error: syncError.message }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        if (!syncResult.success) {
          console.error('❌ Sync failed:', syncResult.error);
          return new Response(
            JSON.stringify({ error: syncResult.error }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        // Update email in auth.users using admin API
        const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
          userId,
          { email }
        );

        if (authUpdateError) {
          console.error('❌ Failed to update auth.users email:', authUpdateError);
          return new Response(
            JSON.stringify({ 
              error: `Profile updated but auth update failed: ${authUpdateError.message}`,
              partialSuccess: true,
              profileUpdated: true,
              authUpdated: false
            }),
            { 
              status: 207, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        console.log('✅ Email successfully synced in both tables');
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Email successfully synced in both auth.users and perfis',
            profileUpdated: true,
            authUpdated: true
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      case 'updateUserData': {
        if (!userId || !userData) {
          return new Response(
            JSON.stringify({ error: 'userId and userData are required' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        console.log(`📝 Updating user data for ${userId}:`, userData);

        // Update perfis table
        const { error: profileError } = await supabaseAdmin
          .from('perfis')
          .update(userData)
          .eq('id', userId);

        if (profileError) {
          console.error('❌ Profile update error:', profileError);
          return new Response(
            JSON.stringify({ error: profileError.message }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        // If email is being updated, sync with auth.users
        if (userData.email) {
          const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
            userId,
            { email: userData.email }
          );

          if (authError) {
            console.warn('⚠️ Profile updated but auth email sync failed:', authError);
          }
        }

        console.log('✅ User data updated successfully');
        return new Response(
          JSON.stringify({
            success: true,
            message: 'User data updated successfully'
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      case 'checkGiovanni': {
        const { data: giovanniResult, error: checkError } = await supabaseAdmin
          .rpc('fix_giovanni_email');

        if (checkError) {
          console.error('❌ Error checking Giovanni:', checkError);
          return new Response(
            JSON.stringify({ error: checkError.message }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        return new Response(
          JSON.stringify(giovanniResult),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
    }

  } catch (error) {
    console.error('🔥 Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});