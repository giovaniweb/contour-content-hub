
import type { MarketingObjectiveType } from '@/types/script';
import type { ScriptType } from '@/utils/api';

export const mapContentTypeToScriptType = (contentType: string): ScriptType => {
  switch (contentType) {
    case 'video':
      return 'videoScript';
    case 'bigIdea':
      return 'bigIdea';
    case 'stories':
    case 'carousel':
    case 'image':
      return 'dailySales';
    default:
      return 'videoScript';
  }
};

export const mapObjectiveToMarketingType = (objective: string): MarketingObjectiveType => {
  if (objective.includes('Vender')) return '🔴 Fazer Comprar';
  if (objective.includes('Atrair')) return '🟡 Atrair Atenção';
  if (objective.includes('Engajar')) return '🟢 Criar Conexão';
  if (objective.includes('autoridade')) return '🟢 Criar Conexão';
  if (objective.includes('leads')) return '🟡 Atrair Atenção';
  return '🟢 Criar Conexão';
};

export const getMentorName = (mentorId: string): string => {
  const mentors: Record<string, string> = {
    'leandro_ladeira': 'Leandro Ladeira',
    'icaro_carvalho': 'Ícaro de Carvalho',
    'paulo_cuenca': 'Paulo Cuenca',
    'pedro_sobral': 'Pedro Sobral',
    'camila_porto': 'Camila Porto',
    'hyeser_souza': 'Hyeser Souza',
    'washington_olivetto': 'Washington Olivetto'
  };
  return mentors[mentorId] || 'Mentor Especializado';
};

export const getSuggestionsForType = (type: string) => {
  return {
    generateImage: type === 'image' || type === 'carousel',
    generateVoice: type === 'video' || type === 'stories',
    relatedVideos: type === 'video' ? ['video-related-1', 'video-related-2'] : undefined
  };
};

export const buildAdditionalInfo = (data: any): string => {
  const parts = [
    `Canal: ${data.channel}`,
    `Estilo: ${data.style}`,
    `Mentor: ${getMentorName(data.selectedMentor)}`,
    `Objetivo: ${data.objective}`
  ];
  
  if (data.additionalNotes) {
    parts.push(`Observações: ${data.additionalNotes}`);
  }
  
  return parts.join('\n');
};
