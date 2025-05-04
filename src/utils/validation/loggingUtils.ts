
/**
 * Helper utility for logging Supabase queries and responses
 */

/**
 * Log a Supabase query with its parameters
 * @param operation The operation being performed (e.g., 'select', 'insert')
 * @param table The table being queried
 * @param params Optional parameters used in the query
 */
export const logQuery = (operation: string, table: string, params?: any): void => {
  console.log(`[Supabase][${operation.toUpperCase()}][${table}] Executing query`, params || '');
};

/**
 * Log a Supabase query result
 * @param operation The operation that was performed
 * @param table The table that was queried
 * @param success Whether the query was successful
 * @param data The data returned (for successful queries)
 * @param error The error returned (for failed queries)
 */
export const logQueryResult = (operation: string, table: string, success: boolean, data?: any, error?: any): void => {
  if (success) {
    console.log(`[Supabase][${operation.toUpperCase()}][${table}] Success:`, 
      data ? `Returned ${Array.isArray(data) ? data.length : 1} records` : 'No data returned');
    
    // Log the data in debug mode only to avoid cluttering the console
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Supabase][${operation.toUpperCase()}][${table}] Data:`, data);
    }
  } else {
    console.error(`[Supabase][${operation.toUpperCase()}][${table}] Error:`, error);
  }
};

/**
 * Utility for debugging complex type errors
 * @param value The value to inspect
 * @param label A label for the value
 */
export const debugType = (value: any, label: string): void => {
  console.log(`[TypeDebug][${label}] Type:`, typeof value);
  console.log(`[TypeDebug][${label}] Is Array:`, Array.isArray(value));
  console.log(`[TypeDebug][${label}] Value:`, value);
  
  if (typeof value === 'object' && value !== null) {
    console.log(`[TypeDebug][${label}] Keys:`, Object.keys(value));
  }
};
