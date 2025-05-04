
/**
 * Template for safe Supabase queries with joins
 * This is a reference file - copy the patterns here for new query functions
 */

import { supabase } from "@/integrations/supabase/client";
import { safeQueryResult, safeSingleResult } from "./supabaseHelpers";

// Example type definition for a result record
type ExampleResultType = {
  id: string;
  categoria: string;
  // Add other fields here
  equipamento?: { nome: string } | null;
  responsavel?: { nome: string } | null;
};

/**
 * Example: Safe query pattern for fetching items with joins
 * 
 * @param someFilter Optional filter parameter
 * @returns The fetched and transformed data
 */
export async function safeQueryExample(
  someFilter?: string
): Promise<any[]> {
  try {
    // Build the query
    const query = supabase
      .from('content_strategy_items')
      .select(`
        *,
        equipamento:equipamento_id (nome),
        responsavel:responsavel_id (nome)
      `)
      .order('created_at', { ascending: false });
    
    // Add any filters
    if (someFilter) {
      query.eq('some_column', someFilter);
    }
    
    // Execute the query
    const response = await query;
    
    // Safely get the result with type assertion after execution
    const data = safeQueryResult<ExampleResultType>(response);
    
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
export async function safeSingleItemQueryExample(
  id: string
): Promise<any | null> {
  try {
    // Build and execute the query
    const response = await supabase
      .from('content_strategy_items')
      .select(`
        *,
        equipamento:equipamento_id (nome),
        responsavel:responsavel_id (nome)
      `)
      .eq('id', id)
      .single();
    
    // Safely get the result with type assertion after execution
    const data = safeSingleResult<ExampleResultType>(response);
    
    // Transform the data to the desired output format
    return data ? transformData(data) : null;
  } catch (error) {
    console.error("Error in query:", error);
    return null;
  }
}

// Example data transformer function
function transformData(data: any): any {
  // Transform the data here
  return {
    ...data,
    // Add any transformations
  };
}
