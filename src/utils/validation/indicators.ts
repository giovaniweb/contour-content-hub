
export interface QualityIndicator {
  color: string;
  label: string;
  icon: string;
}

// Função utilitária para obter indicador visual de qualidade
export const getQualityIndicator = (score: number | null): QualityIndicator => {
  if (score === null) return { color: "gray", label: "Não avaliado", icon: "❓" };
  
  if (score >= 8) return { color: "green", label: "Excelente", icon: "🌟" };
  if (score >= 6) return { color: "yellow", label: "Bom", icon: "👍" };
  if (score >= 4) return { color: "orange", label: "Regular", icon: "⚠️" };
  return { color: "red", label: "Precisa melhorar", icon: "⚠️" };
};
