
import { Equipment } from './base';

/**
 * Import equipment from a file
 */
export const importEquipments = async (file: File): Promise<Equipment[]> => {
  try {
    // Simulate file upload and processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return mock data
    const importedEquipments: Equipment[] = [
      {
        id: `imported-${Date.now()}-1`,
        nome: 'Equipamento Importado 1',
        tecnologia: 'Tecnologia importada',
        beneficios: 'Benefícios importados',
        indicacoes: ['Indicação importada 1', 'Indicação importada 2'],
        diferenciais: 'Diferenciais importados',
        linguagem: 'pt-BR',
        ativo: true,
        efeito: 'Efeito importado',
        image_url: ''
      },
      {
        id: `imported-${Date.now()}-2`,
        nome: 'Equipamento Importado 2',
        tecnologia: 'Tecnologia importada 2',
        beneficios: 'Benefícios importados 2',
        indicacoes: ['Indicação importada 3', 'Indicação importada 4'],
        diferenciais: 'Diferenciais importados 2',
        linguagem: 'pt-BR',
        ativo: true,
        efeito: 'Efeito importado 2',
        image_url: ''
      }
    ];
    
    return importedEquipments;
    
  } catch (error) {
    console.error('Error importing equipments:', error);
    throw error;
  }
};
