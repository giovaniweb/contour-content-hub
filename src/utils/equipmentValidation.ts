
import { Equipment } from '@/types/equipment';

/**
 * Filter equipments to ensure valid IDs and prevent Select.Item errors
 */
export const filterValidEquipments = (equipments: Equipment[]): Equipment[] => {
  if (!Array.isArray(equipments)) {
    console.warn('equipments is not an array:', equipments);
    return [];
  }

  return equipments.filter(equipment => {
    // Check if equipment has required properties
    if (!equipment || typeof equipment !== 'object') {
      console.warn('Invalid equipment object:', equipment);
      return false;
    }

    // Check if equipment has valid ID
    if (!equipment.id || typeof equipment.id !== 'string') {
      console.warn('Equipment missing valid ID:', equipment);
      return false;
    }

    // Check if equipment has valid name
    if (!equipment.nome || typeof equipment.nome !== 'string') {
      console.warn('Equipment missing valid name:', equipment);
      return false;
    }

    return true;
  });
};

/**
 * Get equipment name by ID safely
 */
export const getEquipmentName = (equipments: Equipment[], equipmentId: string): string => {
  const validEquipments = filterValidEquipments(equipments);
  const equipment = validEquipments.find(eq => eq.id === equipmentId);
  return equipment?.nome || 'Equipamento não encontrado';
};

/**
 * Check if equipment ID exists in the list
 */
export const isValidEquipmentId = (equipments: Equipment[], equipmentId: string): boolean => {
  const validEquipments = filterValidEquipments(equipments);
  return validEquipments.some(eq => eq.id === equipmentId);
};
