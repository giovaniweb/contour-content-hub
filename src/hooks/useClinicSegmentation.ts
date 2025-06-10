
import { useMemo } from 'react';
import { useEquipments } from './useEquipments';

type ClinicType = 'medico' | 'estetico' | 'hibrido';

interface ClinicSegmentation {
  clinicType: ClinicType;
  allowedEquipments: any[];
  hasInvasiveEquipments: boolean;
  recommendation: string;
}

// Equipamentos que classificam uma clínica como médica
const MEDICAL_EQUIPMENTS = [
  'Unyque PRO', 
  'Reverso', 
  'Enygma X-Orbital', 
  'Ultralift - Endolaser'
];

// Equipamentos exclusivamente estéticos
const AESTHETIC_EQUIPMENTS = [
  'Crystal 3D Plus', 
  'Multishape', 
  'Focuskin', 
  'Hive Pro', 
  'X-Tonus', 
  'Supreme Pro'
];

export const useClinicSegmentation = (selectedEquipments: string[] = []) => {
  const { equipments } = useEquipments();

  const segmentation = useMemo((): ClinicSegmentation => {
    // Verificar se há equipamentos médicos selecionados
    const hasMedicalEquipments = selectedEquipments.some(eq => 
      MEDICAL_EQUIPMENTS.includes(eq)
    );

    // Verificar se há equipamentos estéticos selecionados
    const hasAestheticEquipments = selectedEquipments.some(eq => 
      AESTHETIC_EQUIPMENTS.includes(eq)
    );

    let clinicType: ClinicType;
    let allowedEquipments = equipments;
    let recommendation = '';

    if (hasMedicalEquipments && hasAestheticEquipments) {
      clinicType = 'hibrido';
      recommendation = 'Clínica híbrida detectada. Você pode usar todos os equipamentos disponíveis.';
    } else if (hasMedicalEquipments) {
      clinicType = 'medico';
      recommendation = 'Clínica médica detectada. Acesso total a equipamentos invasivos e estéticos.';
    } else if (hasAestheticEquipments) {
      clinicType = 'estetico';
      allowedEquipments = equipments.filter(eq => 
        eq.categoria === 'estetico' || !eq.categoria
      );
      recommendation = 'Clínica estética detectada. Equipamentos invasivos restritos.';
    } else {
      clinicType = 'estetico'; // Default
      allowedEquipments = equipments.filter(eq => 
        eq.categoria === 'estetico' || !eq.categoria
      );
      recommendation = 'Selecione equipamentos para definir o tipo de clínica.';
    }

    return {
      clinicType,
      allowedEquipments,
      hasInvasiveEquipments: hasMedicalEquipments,
      recommendation
    };
  }, [selectedEquipments, equipments]);

  return segmentation;
};
