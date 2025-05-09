
// Define the Equipment interface that includes all possible properties
export interface Equipment {
  id: string;
  nome: string;
  tecnologia: string;
  efeito: string;
  beneficios: string;
  diferenciais: string;
  indicacoes: string;
  linguagem: string;
  data_cadastro: string;
  image_url: string;
  ativo: boolean;
  descricao?: string; // Added as optional
  categoria?: string; // Added as optional
}

// Helper function to ensure Equipment objects have all required properties
export function ensureEquipmentFields(equipment: Partial<Equipment>): Equipment {
  return {
    id: equipment.id || '',
    nome: equipment.nome || '',
    tecnologia: equipment.tecnologia || '',
    efeito: equipment.efeito || '',
    beneficios: equipment.beneficios || '',
    diferenciais: equipment.diferenciais || '',
    indicacoes: equipment.indicacoes || '',
    linguagem: equipment.linguagem || '',
    data_cadastro: equipment.data_cadastro || '',
    image_url: equipment.image_url || '',
    ativo: equipment.ativo ?? true,
    descricao: equipment.descricao || '',
    categoria: equipment.categoria || '',
  };
}
