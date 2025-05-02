
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
