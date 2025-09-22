import { useState, useEffect, useMemo } from 'react';
import { equipmentService, Equipment } from '@/services/equipmentService';

export const useEquipmentFilter = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquipments = async () => {
      setIsLoading(true);
      setError(null);
      
      const result = await equipmentService.getAllEquipments();
      
      if (result.error) {
        setError(result.error);
      } else {
        setEquipments(result.data || []);
      }
      
      setIsLoading(false);
    };

    fetchEquipments();
  }, []);

  const getEquipmentName = (equipmentId: string): string => {
    const equipment = equipments.find(eq => eq.id === equipmentId || eq.nome === equipmentId);
    return equipment?.nome || equipmentId || 'Equipamento não encontrado';
  };

  const getEquipmentById = (equipmentId: string): Equipment | undefined => {
    return equipments.find(eq => eq.id === equipmentId);
  };

  const equipmentOptions = useMemo(() => {
    return equipments.map(equipment => ({
      value: equipment.id, // Use equipment ID for database queries
      label: equipment.nome
    }));
  }, [equipments]);

  return {
    equipments,
    equipmentOptions,
    isLoading,
    error,
    getEquipmentName,
    getEquipmentById
  };
};