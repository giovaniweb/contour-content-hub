
import { createClient } from '@supabase/supabase-js';

// Use the actual Supabase project values instead of environment variables
const supabaseUrl = 'https://mksvzhgqnsjfolvskibq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rc3Z6aGdxbnNqZm9sdnNraWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMjg3NTgsImV4cCI6MjA2MTcwNDc1OH0.ERpPooxjvC4BthjXKus6s1xqE7FAE_cjZbEciS_VD4Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Export the base URL for edge functions
export const SUPABASE_BASE_URL = supabaseUrl;
