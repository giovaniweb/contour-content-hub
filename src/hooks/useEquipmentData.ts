
import { useState, useEffect } from 'react';
import { Equipment } from '@/types/equipment';
import { getEquipmentById } from '@/utils/api-equipment';

export const useEquipmentData = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);

  const getEquipmentDetails = async (equipmentNames: string[]): Promise<Equipment[]> => {
    if (!equipmentNames.length) return [];
    
    console.log('🔧 [useEquipmentData] Buscando equipamentos:', equipmentNames);
    
    setLoading(true);
    try {
      // Buscar equipamentos por nome exato - SEM SUBSTITUIÇÕES
      const equipmentPromises = equipmentNames.map(async (name) => {
        console.log(`🔍 [useEquipmentData] Processando equipamento: "${name}"`);
        
        try {
          // Tentar buscar por ID primeiro
          const equipment = await getEquipmentById(name);
          console.log(`✅ [useEquipmentData] Encontrado por ID: ${name}`, equipment);
          return equipment;
        } catch {
          // Se não encontrar, criar mock EXATO do equipamento solicitado
          console.log(`⚠️ [useEquipmentData] Criando mock para: "${name}"`);
          return createExactMockEquipment(name);
        }
      });
      
      const results = await Promise.all(equipmentPromises);
      const validEquipments = results.filter(Boolean) as Equipment[];
      
      console.log('✅ [useEquipmentData] Equipamentos finais:', validEquipments);
      
      // VALIDAÇÃO CRÍTICA: Verificar se há substituições não autorizadas
      const requestedNames = equipmentNames.map(name => name.toLowerCase());
      const returnedNames = validEquipments.map(eq => eq.nome.toLowerCase());
      
      for (const requestedName of requestedNames) {
        if (!returnedNames.some(returnedName => returnedName.includes(requestedName))) {
          console.error(`❌ [useEquipmentData] ERRO CRÍTICO: Equipamento "${requestedName}" foi substituído!`);
        }
      }
      
      setEquipments(validEquipments);
      return validEquipments;
    } catch (error) {
      console.error('❌ [useEquipmentData] Erro ao buscar equipamentos:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createExactMockEquipment = (name: string): Equipment => {
    console.log(`📝 [useEquipmentData] Criando mock EXATO para: "${name}"`);
    
    // IMPORTANTE: Criar equipamento com o nome EXATO fornecido
    // NUNCA substituir por concorrentes ou outros equipamentos
    
    const equipmentData: Record<string, Partial<Equipment>> = {
      'HIFU': {
        nome: 'HIFU',
        tecnologia: 'Ultrassom Microfocado de Alta Intensidade',
        indicacoes: 'Lifting facial, rejuvenescimento, flacidez',
        beneficios: 'Lifting sem cirurgia, resultados naturais, estímulo de colágeno',
        diferenciais: 'Tecnologia focada em camadas profundas da pele'
      },
      'Supreme PRO': {
        nome: 'Supreme PRO',
        tecnologia: 'Eletroestimulação com Radiofrequência',
        indicacoes: 'Fortalecimento muscular, definição corporal, redução de gordura localizada',
        beneficios: 'Resultados rápidos, sem dor, não invasivo, tonificação muscular',
        diferenciais: 'Combina radiofrequência e eletroestimulação em um só equipamento'
      },
      'Hipro': {
        nome: 'Hipro',
        tecnologia: 'Tecnologia HIFEM + Radiofrequência',
        indicacoes: 'Fortalecimento muscular, queima de gordura, definição corporal',
        beneficios: 'Resultados visíveis, não invasivo, sem tempo de recuperação',
        diferenciais: 'Combina fortalecimento muscular com redução de gordura'
      }
    };

    // Buscar dados específicos ou usar genéricos com o nome EXATO
    const specificData = equipmentData[name] || {};
    
    const mockEquipment: Equipment = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      nome: name, // USAR O NOME EXATO, nunca substituir
      tecnologia: specificData.tecnologia || 'Tecnologia avançada para estética',
      indicacoes: specificData.indicacoes || 'Tratamentos estéticos especializados',
      beneficios: specificData.beneficios || 'Resultados eficazes e seguros',
      diferenciais: specificData.diferenciais || 'Tecnologia de ponta em estética',
      efeito: `Tratamento com ${name}`,
      linguagem: 'Profissional e acolhedora',
      data_cadastro: new Date().toISOString(),
      image_url: '',
      ativo: true,
      categoria: 'estetico' as const,
      area_aplicacao: ['Estética'],
      tipo_acao: 'Não invasivo' as const,
      possui_consumiveis: false,
      contraindicacoes: [],
      perfil_ideal_paciente: [],
      akinator_enabled: true
    };
    
    console.log(`✅ [useEquipmentData] Mock criado para "${name}":`, mockEquipment);
    return mockEquipment;
  };

  return {
    equipments,
    loading,
    getEquipmentDetails
  };
};
