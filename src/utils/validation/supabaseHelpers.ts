
import { PostgrestResponse, PostgrestSingleResponse } from "@supabase/supabase-js";

/**
 * A safe type assertion helper for Supabase queries with joins
 * Avoids "Type instantiation is excessively deep and possibly infinite" errors
 * by explicitly breaking the type inference chain with unknown
 * 
 * @param response The raw response from a Supabase query
 * @returns The properly typed data array or null if there was an error
 */
export function safeQueryResult<T>(response: PostgrestResponse<any>): T[] | null {
  if (response.error) {
    console.error("Error executing Supabase query:", response.error);
    return null;
  }
  
  // Use explicit unknown casting to break deep type inference chain
  const rawData = response.data as unknown;
  return rawData as T[];
}

/**
 * A safe type assertion helper for single record Supabase queries with joins
 * Breaks the type inference chain with an explicit unknown cast
 * 
 * @param response The raw response from a Supabase query
 * @returns The properly typed single record or null if there was an error
 */
export function safeSingleResult<T>(response: PostgrestSingleResponse<any>): T | null {
  if (response.error) {
    console.error("Error executing Supabase query:", response.error);
    return null;
  }
  
  // Use explicit unknown casting to break deep type inference chain
  const rawData = response.data as unknown;
  return rawData as T;
}
