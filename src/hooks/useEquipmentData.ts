
import { useState, useEffect } from 'react';
import { Equipment } from '@/hooks/useEquipments';
import { getEquipmentById } from '@/utils/api-equipment';

export const useEquipmentData = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);

  const getEquipmentDetails = async (equipmentNames: string[]): Promise<Equipment[]> => {
    if (!equipmentNames.length) return [];
    
    setLoading(true);
    try {
      // Buscar equipamentos por nome (simulação - adaptar conforme sua API)
      const equipmentPromises = equipmentNames.map(async (name) => {
        try {
          // Se tiver ID, usar getEquipmentById, senão criar mock baseado no nome
          return await getEquipmentById(name);
        } catch {
          // Fallback para equipamentos comuns
          return createMockEquipment(name);
        }
      });
      
      const results = await Promise.all(equipmentPromises);
      const validEquipments = results.filter(Boolean) as Equipment[];
      
      setEquipments(validEquipments);
      return validEquipments;
    } catch (error) {
      console.error('Erro ao buscar equipamentos:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createMockEquipment = (name: string): Equipment => {
    const equipmentData: Record<string, Partial<Equipment>> = {
      'Supreme PRO': {
        nome: 'Supreme PRO',
        tecnologia: 'Eletroestimulação com Radiofrequência',
        indicacoes: 'Fortalecimento muscular, definição corporal, redução de gordura localizada',
        beneficios: 'Resultados rápidos, sem dor, não invasivo, tonificação muscular',
        diferenciais: 'Combina radiofrequência e eletroestimulação em um só equipamento'
      },
      'HIFU': {
        nome: 'HIFU',
        tecnologia: 'Ultrassom Microfocado de Alta Intensidade',
        indicacoes: 'Lifting facial, rejuvenescimento, flacidez',
        beneficios: 'Lifting sem cirurgia, resultados naturais, estímulo de colágeno',
        diferenciais: 'Tecnologia focada em camadas profundas da pele'
      }
    };

    return {
      id: name.toLowerCase(),
      nome: name,
      tecnologia: equipmentData[name]?.tecnologia || 'Tecnologia avançada',
      indicacoes: equipmentData[name]?.indicacoes || 'Tratamento estético especializado',
      beneficios: equipmentData[name]?.beneficios || 'Resultados eficazes e seguros',
      diferenciais: equipmentData[name]?.diferenciais || 'Inovação em estética'
    } as Equipment;
  };

  return {
    equipments,
    loading,
    getEquipmentDetails
  };
};
