
export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Alta': return 'border-red-500/30 text-red-400';
    case 'Média': return 'border-yellow-500/30 text-yellow-400';
    case 'Baixa': return 'border-green-500/30 text-green-400';
    default: return 'border-aurora-electric-purple/30 text-aurora-electric-purple';
  }
};
