import { Equipment, ensureEquipmentFields } from '@/types/equipment';

// This is a wrapper to ensure proper types
export function useTypeSafeBatchVideoManage() {
  // We would normally import the actual hook here
  // For now, we're just exporting the type utilities
  
  return {
    ensureEquipmentFields,
  };
}

export default useTypeSafeBatchVideoManage;
