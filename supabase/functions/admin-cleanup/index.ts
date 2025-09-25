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

    const body = await req.json()
    const { action } = body
    
    console.log('📥 Request received:', { action, body })

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

    if (action === 'delete_user_by_email') {
      const { email } = body
      
      if (!email) {
        return new Response(
          JSON.stringify({ success: false, error: 'Email é obrigatório' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log(`🔍 Buscando usuário por email: ${email}`)
      
      // Verificar se usuário existe em auth.users
      const { data: userCheck } = await supabaseAdmin.rpc('check_user_exists_by_email', { user_email: email })
      
      if (!userCheck?.exists) {
        return new Response(
          JSON.stringify({ success: false, error: 'Usuário não encontrado' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const userId = userCheck.id
      console.log(`👤 Usuário encontrado: ${userId}`)

      // Log da operação
      await supabaseAdmin
        .from('admin_audit_log')
        .insert({
          admin_user_id: user.id,
          action_type: 'DELETE_USER_BY_EMAIL',
          target_user_id: userId,
          old_values: { 
            email: email,
            deletion_method: 'by_email'
          }
        })

      // Remover dados associados em cascata (todas as tabelas públicas)
      const tablesToClean = [
        { table: 'user_actions', column: 'user_id' },
        { table: 'favoritos', column: 'usuario_id' },
        { table: 'video_downloads', column: 'user_id' },
        { table: 'avaliacoes', column: 'usuario_id' },
        { table: 'agenda', column: 'usuario_id' },
        { table: 'alertas_email', column: 'usuario_id' },
        { table: 'user_feature_permissions', column: 'user_id' },
        { table: 'user_gamification', column: 'user_id' },
        { table: 'user_purchase_scores', column: 'user_id' },
        { table: 'academy_user_course_access', column: 'user_id' },
        { table: 'academy_user_lesson_progress', column: 'user_id' },
        { table: 'academy_user_exam_attempts', column: 'user_id' },
        { table: 'academy_user_survey_responses', column: 'user_id' },
        { table: 'ai_feedback', column: 'user_id' },
        { table: 'ai_usage_metrics', column: 'user_id' },
        { table: 'user_memory', column: 'user_id' },
        { table: 'user_content_profiles', column: 'user_id' },
        { table: 'user_usage', column: 'user_id' },
        { table: 'ad_creative_performance', column: 'user_id' },
        { table: 'approved_scripts', column: 'user_id' },
        { table: 'unified_documents', column: 'user_id' }
      ]

      for (const { table, column } of tablesToClean) {
        try {
          const { error: deleteError } = await supabaseAdmin
            .from(table)
            .delete()
            .eq(column, userId)
          
          if (deleteError) {
            console.error(`❌ Erro ao limpar ${table}:`, deleteError)
          } else {
            console.log(`✅ Limpeza concluída em ${table}`)
          }
        } catch (err) {
          console.error(`❌ Erro na limpeza de ${table}:`, err)
        }
      }

      // Remover perfil se existir
      const { error: profileError } = await supabaseAdmin
        .from('perfis')
        .delete()
        .eq('id', userId)

      if (profileError) {
        console.error('❌ Erro ao remover perfil:', profileError)
      } else {
        console.log('✅ Perfil removido')
      }

      // Finalmente, remover o usuário do auth.users
      const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

      if (authDeleteError) {
        console.error('❌ Erro ao remover usuário do auth:', authDeleteError)
        return new Response(
          JSON.stringify({ success: false, error: 'Erro ao remover usuário do sistema de autenticação' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log(`✅ Usuário ${email} removido completamente do sistema`)

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Usuário excluído completamente do sistema',
          email_deleted: email
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