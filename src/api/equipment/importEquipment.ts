
import { Equipment, EquipmentCreationProps } from '@/types/equipment';
import { supabase } from '@/integrations/supabase/client';

export const importEquipments = async (file: File): Promise<Equipment[]> => {
  // Simulating file processing and returning sample equipment
  // In a real implementation, this would parse the file content
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock imported equipment
      const mockImportedEquipments: Equipment[] = [
        {
          id: 'import1',
          nome: 'Equipamento Importado 1',
          descricao: 'Descrição importada',
          categoria: 'estetico', // Changed from 'Importado' to valid categoria
          tecnologia: 'Tecnologia importada',
          beneficios: 'Benefícios importados',
          diferenciais: 'Diferenciais importados',
          linguagem: 'técnica',
          indicacoes: ['Indicação 1', 'Indicação 2'],
          ativo: true,
          data_cadastro: new Date().toISOString(),
          efeito: '',
          image_url: ''
        },
        {
          id: 'import2',
          nome: 'Equipamento Importado 2',
          descricao: 'Outra descrição importada',
          categoria: 'medico', // Changed from 'Importado' to valid categoria
          tecnologia: 'Outra tecnologia importada',
          beneficios: 'Outros benefícios importados',
          diferenciais: 'Outros diferenciais importados',
          linguagem: 'comercial',
          indicacoes: ['Indicação A', 'Indicação B'],
          ativo: true,
          data_cadastro: new Date().toISOString(),
          efeito: '',
          image_url: ''
        }
      ];
      
      resolve(mockImportedEquipments);
    }, 1000);
  });
};
