
import { Equipment } from '@/types/equipment';

export function createMockEquipment(): Equipment {
  return {
    id: `mock_${Date.now()}`,
    nome: 'Equipamento Recomendado',
    tecnologia: 'Tecnologia Avançada',
    indicacoes: 'Tratamentos estéticos diversos',
    beneficios: 'Resultados eficazes e seguros',
    diferenciais: 'Equipamento de última geração',
    efeito: 'Tratamento personalizado',
    linguagem: 'Profissional',
    data_cadastro: new Date().toISOString(),
    image_url: '',
    ativo: true,
    categoria: 'estetico' as const,
    area_aplicacao: ['Facial', 'Corporal'],
    tipo_acao: 'Não invasivo' as const,
    possui_consumiveis: false,
    contraindicacoes: [],
    perfil_ideal_paciente: [],
    akinator_enabled: true,
  };
}
