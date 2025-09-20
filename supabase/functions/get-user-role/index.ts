import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('🚨 No valid authorization header found');
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Create Supabase client with service role for RLS bypass
    const supabaseServiceRole = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify the JWT and get user
    const { data: userData, error: userError } = await supabaseServiceRole.auth.getUser(token);
    
    if (userError || !userData?.user) {
      console.log('🚨 Invalid token or user not found:', userError?.message);
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = userData.user.id;
    console.log('🔐 Getting role for user:', userId);

    // Get user role from perfis table using service role (bypasses RLS)
    const { data: profile, error: profileError } = await supabaseServiceRole
      .from('perfis')
      .select('role, email')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.log('🚨 Error fetching profile:', profileError.message);
      return new Response(
        JSON.stringify({ error: 'Error fetching user profile' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!profile) {
      console.log('🚨 Profile not found for user:', userId);
      return new Response(
        JSON.stringify({ error: 'User profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ User role retrieved successfully:', {
      email: profile.email,
      role: profile.role
    });

    return new Response(
      JSON.stringify({ 
        role: profile.role,
        email: profile.email,
        userId: userId
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('🚨 Unexpected error in get-user-role:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});