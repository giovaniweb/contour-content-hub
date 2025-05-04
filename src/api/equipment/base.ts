
import { supabase } from '@/integrations/supabase/client';
import { Equipment, EquipmentCreationProps, convertStringToArray } from '@/types/equipment';
import { logQuery, logQueryResult } from '@/utils/validation/loggingUtils';

export { supabase, logQuery, logQueryResult, convertStringToArray };
export type { Equipment, EquipmentCreationProps };
