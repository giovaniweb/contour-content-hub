
import { ContentSuggestion } from './types';
import { Equipment } from '@/types/equipment';

// Novo helper para buscar equipamentos reais
export const fetchRealEquipments = async (): Promise<Equipment[]> => {
  // Usando Supabase SDK, ajustando import conforme o caminho do seu projeto
  const { supabase } = await import('@/integrations/supabase/client');
  const { data, error } = await supabase
    .from('equipamentos')
    .select('id, nome, categoria, beneficios, tecnologia, diferenciais, indicacoes, ativo, akinator_enabled')
    .eq('ativo', true)
    .eq('akinator_enabled', true)
    .order('categoria', { ascending: true })
    .order('nome', { ascending: true })
    .limit(10);

  if (error) {
    console.error('Erro ao buscar equipamentos reais:', error);
    return [];
  }
  // @ts-ignore
  return data as Equipment[];
};

// Nova função principal: gera sugestões realmente baseadas nos dados do banco e inputs do usuário
export const generateContentSuggestions = async (
  { clinicType, medicalSpecialty, aestheticFocus, currentRevenue, selectedEquipmentIds, selectedEquipmentNames }: {
    clinicType: string;
    medicalSpecialty?: string;
    aestheticFocus?: string;
    currentRevenue?: string;
    selectedEquipmentIds?: string[];
    selectedEquipmentNames?: string[];
  }
): Promise<ContentSuggestion[]> => {
  const suggestions: ContentSuggestion[] = [];

  // Busca equipamentos reais, filtrando pelo tipo de clínica do usuário
  const equipments = await fetchRealEquipments();
const isClinicaMedica = clinicType === 'clinica_medica';
const perfilEquipamentos = isClinicaMedica
  ? equipments.filter(eq => eq.categoria === 'medico')
  : equipments.filter(eq => eq.categoria === 'estetico');

// Filtro adicional por equipamentos selecionados pelo usuário (IDs ou nomes)
let filteredEquipments = [...perfilEquipamentos];

if (selectedEquipmentIds && selectedEquipmentIds.length > 0) {
  const idSet = new Set(selectedEquipmentIds.map(id => id.trim()));
  filteredEquipments = filteredEquipments.filter(eq => idSet.has(eq.id));
} else if (selectedEquipmentNames && selectedEquipmentNames.length > 0) {
  const nameCandidates = selectedEquipmentNames
    .map(n => n.toLowerCase().trim())
    .filter(Boolean);
  filteredEquipments = filteredEquipments.filter(eq => {
    const nome = (eq.nome || '').toLowerCase();
    return nameCandidates.some(n => nome === n || nome.includes(n));
  });
}

console.log('🔎 Equipamentos - total:', equipments.length, 
  '| perfil:', perfilEquipamentos.length, 
  '| após seleção:', filteredEquipments.length);

const especialidade = isClinicaMedica ? (medicalSpecialty || 'sua especialidade') : (aestheticFocus || 'seu foco');

  // Sugestões baseadas em especialidade real do usuário
  if (especialidade) {
    suggestions.push(
      {
        id: 'before-after',
        title: `Antes e Depois: ${especialidade}`,
        description: `Destaque transformação real em pacientes de ${especialidade}; peça autorização.`,
        format: 'carrossel',
        objective: '🔴 Fazer Comprar',
        estimatedTime: '15-30min',
        difficulty: 'Fácil'
      },
      {
        id: 'education-reels',
        title: `Mitos vs Verdades: ${especialidade}`,
        description: `Reel educativo desmistificando dúvidas sobre ${especialidade}`,
        format: 'reels',
        objective: '🟡 Atrair Atenção',
        estimatedTime: '20-40min',
        difficulty: 'Médio'
      }
    );
  }

  // Sugestões dinâmicas dos equipamentos reais do banco (máx. 3)
  filteredEquipments.slice(0,3).forEach((eq, index) => {
    suggestions.push({
      id: `equipment-${eq.id}`,
      title: `Explique o diferencial do equipamento ${eq.nome}`,
      description: eq.diferenciais || `Mostre por que o equipamento ${eq.nome} é único na sua clínica.`,
      format: index % 2 === 0 ? 'vídeo' : 'carrossel',
      objective: '🔴 Fazer Comprar',
      equipment: eq.nome,
      estimatedTime: '20-45min',
      difficulty: 'Médio'
    });
  });

  // Sugestão baseada em receita real informada pelo usuário
  if (currentRevenue === 'ate_15k') {
    suggestions.push({
      id: 'credibility',
      title: 'Construindo Credibilidade',
      description: 'Stories com certificações, bastidores e depoimentos reais dos seus pacientes.',
      format: 'story',
      objective: '🟢 Criar Conexão',
      estimatedTime: '10-20min',
      difficulty: 'Fácil'
    });
  }

  // Limitar a 6 sugestões para não poluir
  return suggestions.slice(0, 6);
};

