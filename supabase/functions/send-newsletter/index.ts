import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

interface NewsletterRequest {
  subject: string;
  html_content: string;
  text_content?: string;
  target_audience?: 'all' | 'active' | 'premium' | 'academy';
  from_name?: string;
  from_email?: string;
  batch_size?: number;
  delay_between_batches?: number;
}

// Helper function to call the native SMTP email function
async function sendViaNativeSMTP(emailData: any): Promise<any> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase configuration missing for native SMTP call");
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/send-native-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${serviceRoleKey}`,
    },
    body: JSON.stringify(emailData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Native SMTP call failed: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

// Get users based on target audience
async function getTargetAudience(target: string): Promise<any[]> {
  let query = supabase.from('perfis').select('id, nome, email');

  switch (target) {
    case 'active':
      // Users who logged in within the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      query = query.gte('updated_at', thirtyDaysAgo.toISOString());
      break;
    
    case 'premium':
      // Users with premium role or active subscriptions
      query = query.or('role.eq.premium,role.eq.admin');
      break;
    
    case 'academy':
      // Users with academy access - need to properly handle the query
      const { data: academyUserIds } = await supabase
        .from('academy_user_course_access')
        .select('user_id')
        .eq('status', 'approved');
      
      if (academyUserIds && academyUserIds.length > 0) {
        query = query.in('id', academyUserIds.map(u => u.user_id));
      } else {
        // Return empty result if no academy users found
        query = query.eq('id', 'no-users');
      }
      break;
    
    case 'all':
    default:
      // All users
      break;
  }

  const { data, error } = await query;
  
  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  return data || [];
}

// Send newsletter in batches to avoid rate limits
async function sendNewsletterBatch(
  users: any[], 
  emailData: any, 
  batchSize: number, 
  delay: number,
  requestId: string
): Promise<{ sent: number; failed: number; errors: string[] }> {
  
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize);
    
    console.log(`[${requestId}] Sending batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(users.length / batchSize)} (${batch.length} emails)`);

    // Send emails in parallel within batch
    const batchPromises = batch.map(async (user) => {
      try {
        const personalizedEmailData = {
          ...emailData,
          to_email: user.email,
          variables: {
            user: {
              name: user.nome || user.email.split('@')[0],
              email: user.email,
              id: user.id
            }
          }
        };

        await sendViaNativeSMTP(personalizedEmailData);
        return { success: true, email: user.email };
      } catch (error: any) {
        console.error(`[${requestId}] Failed to send to ${user.email}:`, error.message);
        return { success: false, email: user.email, error: error.message };
      }
    });

    const batchResults = await Promise.allSettled(batchPromises);
    
    // Count results
    batchResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        if (result.value.success) {
          sent++;
        } else {
          failed++;
          errors.push(`${result.value.email}: ${result.value.error}`);
        }
      } else {
        failed++;
        errors.push(`Batch processing error: ${result.reason}`);
      }
    });

    // Delay between batches (except for the last batch)
    if (i + batchSize < users.length && delay > 0) {
      console.log(`[${requestId}] Waiting ${delay}ms before next batch...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return { sent, failed, errors };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] Processing newsletter request started`);

  try {
    const { 
      subject,
      html_content,
      text_content,
      target_audience = 'all',
      from_name = "Academia Fluida",
      from_email = "newsletter@academifluida.com",
      batch_size = 10,
      delay_between_batches = 2000
    }: NewsletterRequest = await req.json();

    console.log(`[${requestId}] Newsletter request details:`, { 
      subject: subject?.substring(0, 50) + "...",
      target_audience,
      batch_size,
      delay_between_batches,
      from_name,
      from_email 
    });

    // Validate input
    if (!subject || !html_content) {
      console.error(`[${requestId}] Missing required parameters`);
      return new Response(
        JSON.stringify({ error: "Missing required parameters: subject, html_content" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get target users
    console.log(`[${requestId}] Fetching users for audience: ${target_audience}`);
    const users = await getTargetAudience(target_audience);
    
    if (users.length === 0) {
      console.warn(`[${requestId}] No users found for target audience: ${target_audience}`);
      return new Response(
        JSON.stringify({ 
          warning: "No users found for target audience",
          target_audience,
          sent: 0 
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`[${requestId}] Found ${users.length} users for newsletter`);

    // Prepare email data template
    const emailData = {
      subject,
      html_content,
      text_content,
      from_name,
      from_email,
      priority: 'low' as const
    };

    // Send newsletter in batches
    console.log(`[${requestId}] Starting batch sending...`);
    
    const startTime = Date.now();
    const result = await sendNewsletterBatch(
      users, 
      emailData, 
      batch_size, 
      delay_between_batches,
      requestId
    );
    const endTime = Date.now();

    console.log(`[${requestId}] Newsletter sending completed:`, {
      total_users: users.length,
      sent: result.sent,
      failed: result.failed,
      duration_ms: endTime - startTime
    });

    // Save newsletter stats (opcional)
    try {
      await supabase.from('newsletter_stats').insert({
        subject,
        target_audience,
        total_recipients: users.length,
        sent_count: result.sent,
        failed_count: result.failed,
        sent_at: new Date().toISOString(),
        duration_ms: endTime - startTime
      });
    } catch (statsError) {
      console.warn(`[${requestId}] Failed to save newsletter stats:`, statsError);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Newsletter sending completed",
        stats: {
          total_recipients: users.length,
          sent: result.sent,
          failed: result.failed,
          duration_ms: endTime - startTime,
          errors: result.errors.slice(0, 10) // Only first 10 errors
        },
        request_id: requestId
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error(`[${requestId}] Critical error in send-newsletter function:`, {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return new Response(
      JSON.stringify({ 
        error: error.message,
        request_id: requestId,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);