
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    )

    const authorization = req.headers.get('Authorization')
    if (authorization) {
      supabaseClient.auth.setSession({
        access_token: authorization.replace('Bearer ', ''),
        refresh_token: ''
      })
    }

    const { action, code } = await req.json(); // CORRIGIDO: apenas um await

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (action !== "get_auth_url" && !user) {
      throw new Error('User not authenticated')
    }

    switch (action) {
      case 'get_auth_url':
        return await getInstagramAuthUrl()
      case 'exchange_code':
        if (!code) throw new Error('Missing code for exchange_code')
        return await exchangeCodeForToken(supabaseClient, user.id, code)
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function getInstagramAuthUrl() {
  const clientId = Deno.env.get('INSTAGRAM_CLIENT_ID')
  const redirectUri = Deno.env.get('INSTAGRAM_REDIRECT_URI')
  
  if (!clientId || !redirectUri) {
    throw new Error('Instagram OAuth credentials not configured')
  }

  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user_profile,user_media&response_type=code`

  return new Response(
    JSON.stringify({ 
      success: true, 
      auth_url: authUrl 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function exchangeCodeForToken(supabaseClient: any, userId: string, code: string) {
  const clientId = Deno.env.get('INSTAGRAM_CLIENT_ID')
  const clientSecret = Deno.env.get('INSTAGRAM_CLIENT_SECRET')
  const redirectUri = Deno.env.get('INSTAGRAM_REDIRECT_URI')

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Instagram OAuth credentials not configured')
  }

  try {
    // Exchange code for short-lived token
    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code: code,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      throw new Error('Failed to get access token')
    }

    // Exchange short-lived for long-lived token
    const longLivedResponse = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${clientSecret}&access_token=${tokenData.access_token}`
    )

    const longLivedData = await longLivedResponse.json()

    // Get user info
    const userResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${longLivedData.access_token}`
    )

    const userData = await userResponse.json()

    // Save to database
    const { error } = await supabaseClient
      .from('instagram_configs')
      .upsert({
        user_id: userId,
        access_token: longLivedData.access_token,
        instagram_user_id: userData.id,
        username: userData.username,
        account_type: userData.account_type || 'personal',
      }, {
        onConflict: 'user_id'
      })

    if (error) throw error

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: userData 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('OAuth exchange error:', error)
    throw new Error('Failed to complete Instagram authentication')
  }
}
