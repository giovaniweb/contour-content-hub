
/**
 * Template for safe Supabase queries with joins
 * This is a reference file - copy the patterns here for new query functions
 */

import { supabase } from "@/integrations/supabase/client";
import { safeQueryResult, safeSingleResult } from "./supabaseHelpers";

/**
 * Example: Safe query pattern for fetching items with joins
 * 
 * @param someFilter Optional filter parameter
 * @returns The fetched and transformed data
 */
export async function safeQueryExample<ResultType, TransformedType>(
  someFilter?: string
): Promise<TransformedType[]> {
  try {
    // Build the query
    const query = supabase
      .from('some_table')
      .select(`
        *,
        related_table:related_id (field1, field2)
      `)
      .order('created_at', { ascending: false });
    
    // Add any filters
    if (someFilter) {
      query.eq('some_column', someFilter);
    }
    
    // Execute the query
    const response = await query;
    
    // Safely get the result with type assertion after execution
    const data = safeQueryResult<ResultType>(response);
    
    // Transform the data to the desired output format
    return data ? data.map(item => transformData(item)) : [];
  } catch (error) {
    console.error("Error in query:", error);
    return [];
  }
}

/**
 * Example: Safe single-item query pattern
 */
export async function safeSingleItemQueryExample<ResultType, TransformedType>(
  id: string
): Promise<TransformedType | null> {
  try {
    // Build and execute the query
    const response = await supabase
      .from('some_table')
      .select(`
        *,
        related_table:related_id (field1, field2)
      `)
      .eq('id', id)
      .single();
    
    // Safely get the result with type assertion after execution
    const data = safeSingleResult<ResultType>(response);
    
    // Transform the data to the desired output format
    return data ? transformData(data) : null;
  } catch (error) {
    console.error("Error in query:", error);
    return null;
  }
}

// Example data transformer function
function transformData<ResultType>(data: ResultType): any {
  // Transform the data here
  return {
    ...data,
    // Add any transformations
  };
}
