
import { Equipment } from '@/types/equipment';

/**
 * Utility function to filter and validate equipments for use in Select components
 * This prevents the "Select.Item must have a value prop that is not an empty string" error
 */
export const filterValidEquipments = (equipments: Equipment[]): Equipment[] => {
  return equipments.filter(equipment => 
    equipment && 
    equipment.id && 
    equipment.id.trim() !== "" && 
    equipment.nome && 
    equipment.nome.trim() !== ""
  );
};

/**
 * Validate if an equipment object is safe to use in Select components
 */
export const isValidEquipment = (equipment: any): equipment is Equipment => {
  return (
    equipment &&
    typeof equipment === 'object' &&
    equipment.id &&
    typeof equipment.id === 'string' &&
    equipment.id.trim() !== "" &&
    equipment.nome &&
    typeof equipment.nome === 'string' &&
    equipment.nome.trim() !== ""
  );
};

/**
 * Get equipment name by ID, with fallback for invalid equipments
 */
export const getEquipmentName = (equipmentId: string, equipments: Equipment[]): string => {
  const validEquipments = filterValidEquipments(equipments);
  const equipment = validEquipments.find(eq => eq.id === equipmentId);
  return equipment?.nome || 'Equipamento não encontrado';
};
