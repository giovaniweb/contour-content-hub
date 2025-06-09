
export const getPlatformColor = (platform: string) => {
  switch (platform) {
    case 'Instagram': return 'bg-gradient-to-r from-purple-500 to-pink-500';
    case 'YouTube': return 'bg-red-500';
    case 'Facebook': return 'bg-blue-500';
    default: return 'bg-aurora-electric-purple';
  }
};

export const getEngagementColor = (engagement: string) => {
  switch (engagement) {
    case 'Muito Alto': return 'border-green-500/30 text-green-400';
    case 'Alto': return 'border-yellow-500/30 text-yellow-400';
    case 'Médio': return 'border-blue-500/30 text-blue-400';
    default: return 'border-aurora-electric-purple/30 text-aurora-electric-purple';
  }
};
