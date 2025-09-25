import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create client with user token to verify admin access
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        },
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    )

    // Get current user
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid user token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify user is admin
    const { data: profile } = await supabaseAdmin
      .from('perfis')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'superadmin'].includes(profile.role)) {
      return new Response(
        JSON.stringify({ error: 'Access denied. Admin privileges required.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { action } = await req.json()

    if (action === 'cleanup_orphaned_users') {
      console.log('🧹 Starting orphaned users cleanup...')
      
      // Get orphaned users (exist in auth.users but not in perfis)
      const { data: orphanedUsers, error: fetchError } = await supabaseAdmin
        .from('auth.users')
        .select('id, email, created_at')
        .not('id', 'in', `(SELECT id FROM perfis)`)

      if (fetchError) {
        console.error('❌ Error fetching orphaned users:', fetchError)
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to fetch orphaned users' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const orphanedCount = orphanedUsers?.length || 0
      console.log(`📊 Found ${orphanedCount} orphaned users`)

      if (orphanedCount > 0) {
        // Log the operation in admin audit log
        await supabaseAdmin
          .from('admin_audit_log')
          .insert({
            admin_user_id: user.id,
            action_type: 'CLEANUP_ORPHANED_USERS',
            old_values: { 
              orphaned_users_found: orphanedCount,
              orphaned_users_list: orphanedUsers.map(u => ({ id: u.id, email: u.email }))
            }
          })

        // Delete orphaned users from auth.users
        for (const orphanedUser of orphanedUsers) {
          console.log(`🗑️ Deleting orphaned user: ${orphanedUser.email}`)
          
          const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
            orphanedUser.id
          )
          
          if (deleteError) {
            console.error(`❌ Error deleting user ${orphanedUser.email}:`, deleteError)
          } else {
            console.log(`✅ Successfully deleted orphaned user: ${orphanedUser.email}`)
          }
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Orphaned users cleanup completed successfully',
          orphaned_users_cleaned: orphanedCount,
          cleaned_users: orphanedUsers?.map(u => u.email) || []
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'get_orphaned_stats') {
      // Get count of orphaned users
      const { data: orphanedUsers, error: fetchError } = await supabaseAdmin
        .from('auth.users')
        .select('id, email, created_at')
        .not('id', 'in', `(SELECT id FROM perfis)`)

      if (fetchError) {
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to fetch orphaned users stats' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({
          success: true,
          orphaned_count: orphanedUsers?.length || 0,
          orphaned_users: orphanedUsers || []
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Error in admin-cleanup function:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: (error as Error).message || 'Internal server error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})