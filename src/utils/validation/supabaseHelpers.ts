
// Helper functions for safe Supabase query result handling

export function safeQueryResult<T>(response: { data: T[] | null; error: any }): T[] | null {
  if (response.error) {
    console.error('Supabase query error:', response.error);
    return null;
  }
  return response.data;
}

export function safeSingleResult<T>(response: { data: T | null; error: any }): T | null {
  if (response.error) {
    console.error('Supabase single query error:', response.error);
    return null;
  }
  return response.data;
}

export function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export function handleSupabaseError(error: any, context: string = 'Unknown'): string {
  console.error(`Supabase error in ${context}:`, error);
  
  if (error?.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return `Erro em ${context}`;
}
