
import { MarketingConsultantState } from '../../types';
import { ContentSuggestion } from './types';

export const generateContentSuggestions = (state: MarketingConsultantState): ContentSuggestion[] => {
  const suggestions: ContentSuggestion[] = [];

  // Sugestões baseadas no tipo de clínica e equipamentos
  const isClinicaMedica = state.clinicType === 'clinica_medica';
  const equipamentos = isClinicaMedica ? state.medicalEquipments : state.aestheticEquipments;
  const especialidade = isClinicaMedica ? state.medicalSpecialty : state.aestheticFocus;

  // Sugestões padrão baseadas no perfil
  const baseSuggestions: ContentSuggestion[] = [
    {
      id: 'before-after',
      title: `Antes e Depois: ${especialidade}`,
      description: `Showcase transformador de resultados reais com ${especialidade}`,
      format: 'carrossel',
      objective: '🔴 Fazer Comprar',
      estimatedTime: '15-30min',
      difficulty: 'Fácil'
    },
    {
      id: 'education-reels',
      title: `Mitos vs Verdades: ${especialidade}`,
      description: 'Reel educativo desmistificando dúvidas comuns',
      format: 'reels',
      objective: '🟡 Atrair Atenção',
      estimatedTime: '20-40min',
      difficulty: 'Médio'
    },
    {
      id: 'process-video',
      title: `Como funciona: Processo Completo`,
      description: 'Vídeo explicativo do atendimento da consulta ao resultado',
      format: 'vídeo',
      objective: '🟢 Criar Conexão',
      estimatedTime: '45-60min',
      difficulty: 'Avançado'
    }
  ];

  suggestions.push(...baseSuggestions);

  // Adicionar sugestões específicas por equipamento
  if (equipamentos) {
    const equipList = equipamentos.split(',').map(eq => eq.trim());
    equipList.forEach((equip, index) => {
      if (equip && index < 2) { // Máximo 2 equipamentos para não poluir
        suggestions.push({
          id: `equipment-${index}`,
          title: `Destaque: ${equip}`,
          description: `Conteúdo focado nos diferenciais e benefícios do ${equip}`,
          format: index % 2 === 0 ? 'vídeo' : 'carrossel',
          objective: '🔴 Fazer Comprar',
          equipment: equip,
          estimatedTime: '25-45min',
          difficulty: 'Médio'
        });
      }
    });
  }

  // Sugestões baseadas no objetivo
  if (state.currentRevenue === 'ate_15k') {
    suggestions.push({
      id: 'credibility',
      title: 'Construindo Credibilidade',
      description: 'Stories mostrando certificações, cursos e experiência',
      format: 'story',
      objective: '🟢 Criar Conexão',
      estimatedTime: '10-20min',
      difficulty: 'Fácil'
    });
  }

  return suggestions.slice(0, 6); // Máximo 6 sugestões
};
