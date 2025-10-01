import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UpdateFeatureStatusRequest {
  feature: string;
  newStatus: 'blocked' | 'coming_soon' | 'beta' | 'released';
  notes?: string;
  userIds?: string[]; // Optional: specific users, if empty applies to all
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
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

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabaseClient
      .from('perfis')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || !['admin', 'superadmin'].includes(profile.role)) {
      console.error('Authorization error:', profileError);
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body: UpdateFeatureStatusRequest = await req.json();
    const { feature, newStatus, notes, userIds } = body;

    console.log('Update feature status request:', { feature, newStatus, userIds: userIds?.length || 'all', adminId: user.id });

    // Get old status for logging (from any user)
    const { data: oldPermission } = await supabaseClient
      .from('user_feature_permissions')
      .select('status')
      .eq('feature', feature)
      .limit(1)
      .single();

    const oldStatus = oldPermission?.status || null;

    // Update permissions
    let query = supabaseClient
      .from('user_feature_permissions')
      .update({ status: newStatus })
      .eq('feature', feature);

    // If specific userIds provided, only update those
    if (userIds && userIds.length > 0) {
      query = query.in('user_id', userIds);
    }

    const { data: updatedPermissions, error: updateError } = await query.select('user_id');

    if (updateError) {
      console.error('Error updating permissions:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update permissions', details: updateError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const affectedUsersCount = updatedPermissions?.length || 0;

    // Log the change
    const { error: logError } = await supabaseClient
      .from('feature_status_changes')
      .insert({
        feature,
        old_status: oldStatus,
        new_status: newStatus,
        changed_by: user.id,
        notes: notes || null,
        affected_users_count: affectedUsersCount,
      });

    if (logError) {
      console.error('Error logging status change:', logError);
      // Don't fail the request if logging fails
    }

    console.log('Feature status updated successfully:', {
      feature,
      oldStatus,
      newStatus,
      affectedUsers: affectedUsersCount,
    });

    return new Response(
      JSON.stringify({
        success: true,
        feature,
        oldStatus,
        newStatus,
        affectedUsersCount,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
