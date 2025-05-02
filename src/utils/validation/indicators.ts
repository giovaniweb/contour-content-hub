
/**
 * Retorna uma indicação de qualidade baseado na pontuação
 */
export const getQualityIndicator = (score: number): {
  label: string;
  color: string;
  emoji: string;
} => {
  if (score >= 9) {
    return {
      label: "Excelente",
      color: "text-green-600",
      emoji: "🌟"
    };
  } else if (score >= 8) {
    return {
      label: "Muito bom",
      color: "text-green-500",
      emoji: "✨"
    };
  } else if (score >= 7) {
    return {
      label: "Bom",
      color: "text-blue-500",
      emoji: "👍"
    };
  } else if (score >= 6) {
    return {
      label: "Razoável",
      color: "text-yellow-500",
      emoji: "👌"
    };
  } else if (score >= 5) {
    return {
      label: "Necessita melhorias",
      color: "text-orange-500",
      emoji: "⚠️"
    };
  } else {
    return {
      label: "Precisa de revisão",
      color: "text-red-500",
      emoji: "❗"
    };
  }
};

/**
 * Retorna a cor do indicador com base na pontuação
 */
export const getIndicatorColor = (score: number): string => {
  if (score >= 8) return "bg-green-100 text-green-700";
  if (score >= 6) return "bg-blue-100 text-blue-700";
  if (score >= 5) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};

/**
 * Retorna o emoji do indicador com base na pontuação
 */
export const getIndicatorEmoji = (score: number): string => {
  if (score >= 8) return "✨";
  if (score >= 6) return "👍";
  if (score >= 5) return "⚠️";
  return "❗";
};
