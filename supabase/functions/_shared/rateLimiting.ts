// P0-003: Utilitário de Rate Limiting para Edge Functions
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

interface RateLimitConfig {
  maxRequests: number;
  windowMinutes: number;
  endpoint: string;
}

interface RateLimitResult {
  allowed: boolean;
  requests_made: number;
  requests_remaining: number;
  reset_time: string;
  error?: string;
}

export const checkRateLimit = async (
  identifier: string, // user_id ou IP
  config: RateLimitConfig
): Promise<RateLimitResult> => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  );

  try {
    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_identifier: identifier,
      p_endpoint: config.endpoint,
      p_max_requests: config.maxRequests,
      p_window_minutes: config.windowMinutes
    });

    if (error) {
      console.error('Rate limit check error:', error);
      // Em caso de erro, permitir a requisição (fail open)
      return {
        allowed: true,
        requests_made: 0,
        requests_remaining: config.maxRequests,
        reset_time: new Date(Date.now() + config.windowMinutes * 60000).toISOString()
      };
    }

    return data as RateLimitResult;
  } catch (error) {
    console.error('Rate limit system error:', error);
    // Em caso de erro, permitir a requisição (fail open)
    return {
      allowed: true,
      requests_made: 0,
      requests_remaining: config.maxRequests,
      reset_time: new Date(Date.now() + config.windowMinutes * 60000).toISOString()
    };
  }
};

export const getRateLimitHeaders = (result: RateLimitResult): Record<string, string> => {
  return {
    'X-RateLimit-Limit': result.requests_made.toString(),
    'X-RateLimit-Remaining': result.requests_remaining.toString(),
    'X-RateLimit-Reset': result.reset_time
  };
};

export const createRateLimitResponse = (result: RateLimitResult, corsHeaders: Record<string, string>) => {
  return new Response(
    JSON.stringify({
      error: 'Rate limit exceeded',
      message: `Too many requests. Try again after ${result.reset_time}`,
      retry_after: result.reset_time
    }),
    {
      status: 429,
      headers: {
        ...corsHeaders,
        ...getRateLimitHeaders(result),
        'Content-Type': 'application/json',
        'Retry-After': Math.ceil((new Date(result.reset_time).getTime() - Date.now()) / 1000).toString()
      }
    }
  );
};

export const getClientIdentifier = (req: Request, userId?: string): string => {
  // Priorizar user_id se disponível, senão usar IP
  if (userId) return `user:${userId}`;
  
  // Tentar obter IP real dos headers
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  
  const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown';
  return `ip:${ip}`;
};