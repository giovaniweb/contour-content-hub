
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
          categoria: 'Importado',
          tecnologia: 'Tecnologia importada',
          beneficios: 'Benefícios importados',
          diferenciais: 'Diferenciais importados',
          linguagem: 'técnica',
          indicacoes: ['Indicação 1', 'Indicação 2'],
          ativo: true,
          data_cadastro: new Date().toISOString(),
          efeito: '',             // Add missing property
          image_url: ''           // Add missing property
        },
        {
          id: 'import2',
          nome: 'Equipamento Importado 2',
          descricao: 'Outra descrição importada',
          categoria: 'Importado',
          tecnologia: 'Outra tecnologia importada',
          beneficios: 'Outros benefícios importados',
          diferenciais: 'Outros diferenciais importados',
          linguagem: 'comercial',
          indicacoes: ['Indicação A', 'Indicação B'],
          ativo: true,
          data_cadastro: new Date().toISOString(),
          efeito: '',             // Add missing property
          image_url: ''           // Add missing property
        }
      ];
      
      resolve(mockImportedEquipments);
    }, 1000);
  });
};
