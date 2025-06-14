
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
  { clinicType, medicalSpecialty, aestheticFocus, currentRevenue }: {
    clinicType: string;
    medicalSpecialty?: string;
    aestheticFocus?: string;
    currentRevenue?: string;
  }
): Promise<ContentSuggestion[]> => {
  const suggestions: ContentSuggestion[] = [];

  // Busca equipamentos reais, filtrando pelo tipo de clínica do usuário
  const equipments = await fetchRealEquipments();
  const isClinicaMedica = clinicType === 'clinica_medica';
  const perfilEquipamentos = isClinicaMedica
    ? equipments.filter(eq => eq.categoria === 'medico')
    : equipments.filter(eq => eq.categoria === 'estetico');

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
  perfilEquipamentos.slice(0,3).forEach((eq, index) => {
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

