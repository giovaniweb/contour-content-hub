

/**
 * Validate that data matches expected shape
 * Useful for debugging Supabase query results
 * 
 * @param data The data to validate
 * @param requiredFields Array of required field paths (can be nested using dot notation)
 * @returns Object with validation result and missing fields if any
 */
export function validateDataShape<T>(
  data: T | T[] | null | undefined,
  requiredFields: string[]
): { valid: boolean; missingFields: string[] } {
  // Handle null/undefined data
  if (!data) {
    return { valid: false, missingFields: ['<data is null or undefined>'] };
  }

  // Convert single item to array for consistent processing
  const items = Array.isArray(data) ? data : [data];
  
  if (items.length === 0) {
    return { valid: true, missingFields: [] }; // Empty array is valid
  }
  
  const missingFields: string[] = [];
  
  // Check each item against required fields
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    for (const fieldPath of requiredFields) {
      const parts = fieldPath.split('.');
      let current: any = item;
      let isValid = true;
      
      // Navigate through nested properties
      for (const part of parts) {
        if (current === null || current === undefined || !Object.hasOwnProperty.call(current, part)) {
          missingFields.push(`${fieldPath} in item[${i}]`);
          isValid = false;
          break;
        }
        current = current[part];
      }
      
      if (!isValid) break;
    }
  }
  
  return {
    valid: missingFields.length === 0,
    missingFields
  };
}

/**
 * Sample usage for ContentStrategy validation
 */
export function validateContentStrategyData(data: any): boolean {
  const result = validateDataShape(data, [
    'id',
    'categoria',
    'formato',
    'objetivo',
    'status'
  ]);
  
  if (!result.valid) {
    console.error('Invalid ContentStrategy data:', result.missingFields);
  }
  
  return result.valid;
}
