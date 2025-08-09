/**
 * Utilitários para cálculo de tempo baseado em conteúdo de roteiro
 */

export interface TimeInfo {
  totalWords: number;
  estimatedSeconds: number;
  displayTime: string;
  isOverLimit: boolean;
}

export const calculateContentTime = (content: string, wordsPerSecond: number = 2.5): TimeInfo => {
  if (!content || content.trim() === '') {
    return {
      totalWords: 0,
      estimatedSeconds: 0,
      displayTime: '0s',
      isOverLimit: false
    };
  }

  // Remove timestamps, marcadores e limpa o texto para contagem precisa
  const cleanContent = content
    .replace(/\[\d+(?:-\d+)?s\]/g, '') // Remove timestamps
    .replace(/^\s*(?:gancho|ação|cta|narrador|off|story\s*\d+|slide\s*\d+)\s*:\s*/gmi, '') // Remove rótulos
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown
    .replace(/[^\w\s]/g, ' ') // Remove pontuação para contagem limpa
    .replace(/\s+/g, ' ')
    .trim();

  const words = cleanContent.split(' ').filter(word => word.length > 0);
  const totalWords = words.length;
  const estimatedSeconds = Math.round(totalWords / wordsPerSecond);
  
  // Formata o tempo de exibição
  let displayTime: string;
  if (estimatedSeconds < 60) {
    displayTime = `${estimatedSeconds}s`;
  } else {
    const minutes = Math.floor(estimatedSeconds / 60);
    const remainingSeconds = estimatedSeconds % 60;
    displayTime = `${minutes}m${remainingSeconds > 0 ? ` ${remainingSeconds}s` : ''}`;
  }

  return {
    totalWords,
    estimatedSeconds,
    displayTime,
    isOverLimit: estimatedSeconds > 45 // Limite padrão para reels/stories
  };
};

export const extractTimeFromContent = (content: string): string => {
  // Tenta extrair tempo existente do conteúdo
  const timeMatch = content.match(/\[(\d+(?:-\d+)?s)\]/);
  if (timeMatch) {
    return timeMatch[1];
  }

  // Calcula tempo baseado no conteúdo
  const timeInfo = calculateContentTime(content);
  return timeInfo.displayTime;
};

export const parseTimeString = (timeStr: string): number => {
  // Converte string de tempo para segundos
  if (!timeStr) return 0;
  
  // Formato: "1-3s" -> pega o valor médio
  const rangeMatch = timeStr.match(/(\d+)-(\d+)s/);
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1]);
    const end = parseInt(rangeMatch[2]);
    return Math.round((start + end) / 2);
  }
  
  // Formato: "30s"
  const simpleMatch = timeStr.match(/(\d+)s/);
  if (simpleMatch) {
    return parseInt(simpleMatch[1]);
  }
  
  return 0;
};