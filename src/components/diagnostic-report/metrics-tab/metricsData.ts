
export const generateCurrentMetrics = () => ({
  followers: Math.floor(Math.random() * 5000) + 1000,
  engagement: (Math.random() * 3 + 1).toFixed(1),
  reach: Math.floor(Math.random() * 10000) + 2000,
  leads: Math.floor(Math.random() * 50) + 10
});

export const generateProjectedMetrics = (currentMetrics: any) => ({
  followers: Math.floor(currentMetrics.followers * 1.5),
  engagement: (parseFloat(currentMetrics.engagement) * 1.3).toFixed(1),
  reach: Math.floor(currentMetrics.reach * 2),
  leads: Math.floor(currentMetrics.leads * 2.5)
});

export const kpis = [
  {
    name: "Taxa de Conversão",
    current: "2.5%",
    target: "4.0%",
    status: "improvement",
    icon: "Target"
  },
  {
    name: "Custo por Lead",
    current: "R$ 45",
    target: "R$ 30",
    status: "improvement",
    icon: "TrendingUp"
  },
  {
    name: "ROI Marketing",
    current: "180%",
    target: "250%",
    status: "improvement", 
    icon: "TrendingUp"
  },
  {
    name: "Tempo Médio de Conversão",
    current: "7 dias",
    target: "5 dias",
    status: "improvement",
    icon: "Calendar"
  }
];

export const engagementMetrics = [
  { name: "Curtidas", value: "1.2K", growth: "+15%", icon: "Heart", color: "text-red-400" },
  { name: "Comentários", value: "89", growth: "+22%", icon: "MessageCircle", color: "text-blue-400" },
  { name: "Compartilhamentos", value: "156", growth: "+8%", icon: "Share2", color: "text-green-400" },
  { name: "Visualizações", value: "8.5K", growth: "+18%", icon: "Eye", color: "text-purple-400" }
];
