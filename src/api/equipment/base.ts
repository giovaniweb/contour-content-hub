
import { supabase } from '@/integrations/supabase/client';
import { Equipment, EquipmentCreationProps } from '@/types/equipment';
import { logQuery, logQueryResult } from '@/utils/validation/loggingUtils';

// Re-exportar para uso nos outros módulos
export { supabase, logQuery, logQueryResult };
export type { Equipment, EquipmentCreationProps };

// Convert string to array helper
export const convertStringToArray = (str: string): string[] => {
  if (!str) return [];
  if (Array.isArray(str)) return str;
  
  // Try to parse if it's a JSON string
  try {
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
    // Not a JSON string, continue with split
  }
  
  // Split by common delimiters (semicolons, commas, or line breaks)
  return str
    .split(/[;,\n]/)
    .map(item => item.trim())
    .filter(Boolean);
};

// Utilitários auxiliares específicos para equipamentos
export const isEquipmentActive = (equipment: Equipment): boolean => {
  return equipment.ativo === true;
};

export const formatEquipmentName = (name: string): string => {
  return name.trim();
};
