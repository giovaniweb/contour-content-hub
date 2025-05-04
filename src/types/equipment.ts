
/**
 * Tipos para equipamentos
 */

export interface Equipment {
  id: string;
  nome: string;
  efeito?: string;
  beneficios?: string;
  tecnologia?: string;
  fabricante?: string;
  site?: string;
  ativo: boolean;
  categoria?: string;
  modelo?: string;
  pais_origem?: string;
  reg_anvisa?: string;
  classificacao?: string;
  ano_lancamento?: string;
  garantia?: string;
  parametros?: string;
  protocolos?: string;
  indicacoes?: string[];
  contraindicacoes?: string[];
  caracteristicas?: string[];
  beneficios_lista?: string[];
  areas_corpo?: string[];
}

export interface EquipmentFilters {
  searchTerm?: string;
  status?: 'active' | 'inactive' | 'all';
  category?: string;
  technology?: string;
}
