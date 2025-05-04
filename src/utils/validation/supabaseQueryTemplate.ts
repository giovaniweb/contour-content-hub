
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
      `);
    
    // Add any filters
    if (someFilter) {
      // Force casting the query to any to break type inference chain
      (query as any).eq('some_column', someFilter);
    }
    
    // Execute the query - force type as any to break inference chain
    const response = await (query as any);
    
    // Break type inference chain with explicit unknown cast
    // This prevents "Type instantiation is excessively deep" errors
    const rawData = response.data as unknown;
    
    // Explicitly cast to the expected type
    const data = rawData as ExampleResultType[] | null;
    
    // Transform the data to the desired output format - with explicit intermediate typing
    return data ? data.map((item: ExampleResultType) => transformData(item)) : [];
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
    // Build query with explicit any typing to break inference
    const query = supabase
      .from('content_strategy_items')
      .select(`
        *,
        equipamento:equipamento_id (nome),
        responsavel:responsavel_id (nome)
      `) as any;
    
    // Execute with explicit any typing
    const response = await query.eq('id', id).single();
    
    // Break type inference chain with explicit unknown helper
    const rawData = response.data as unknown;
    
    // Cast to expected type
    const data = rawData as ExampleResultType | null;
    
    // Transform the data with explicit typing
    return data ? transformData(data) : null;
  } catch (error) {
    console.error("Error in query:", error);
    return null;
  }
}

// Example data transformer function with explicit return type
function transformData(data: ExampleResultType): any {
  // Transform the data here
  return {
    ...data,
    // Add any transformations
  };
}
