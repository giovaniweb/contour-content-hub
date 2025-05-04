
import { PostgrestResponse, PostgrestSingleResponse } from "@supabase/supabase-js";

/**
 * A safe type assertion helper for Supabase queries with joins
 * Avoids "Type instantiation is excessively deep and possibly infinite" errors
 * 
 * @param response The raw response from a Supabase query
 * @returns The properly typed data array or null if there was an error
 */
export function safeQueryResult<T>(response: PostgrestResponse<unknown>): T[] | null {
  if (response.error) {
    console.error("Error executing Supabase query:", response.error);
    return null;
  }
  
  return response.data as T[];
}

/**
 * A safe type assertion helper for single record Supabase queries with joins
 * 
 * @param response The raw response from a Supabase query
 * @returns The properly typed single record or null if there was an error
 */
export function safeSingleResult<T>(response: PostgrestSingleResponse<unknown>): T | null {
  if (response.error) {
    console.error("Error executing Supabase query:", response.error);
    return null;
  }
  
  return response.data as T;
}
