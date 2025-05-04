
import { supabase } from '@/integrations/supabase/client';
import { Equipment, EquipmentCreationProps, convertStringToArray } from '@/types/equipment';
import { logQuery, logQueryResult } from '@/utils/validation/loggingUtils';

// Re-exportar para uso nos outros módulos
export { supabase, logQuery, logQueryResult, convertStringToArray };
export type { Equipment, EquipmentCreationProps };

// Utilitários auxiliares específicos para equipamentos
export const isEquipmentActive = (equipment: Equipment): boolean => {
  return equipment.ativo === true;
};

export const formatEquipmentName = (name: string): string => {
  return name.trim();
};
