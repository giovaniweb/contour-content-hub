
// Define the specific types for better type safety
type KPIIconType = "Target" | "TrendingUp" | "Calendar";
type EngagementIconType = "Heart" | "MessageCircle" | "Share2" | "Eye";

interface Metric {
  name: string;
  current: string;
  projected: string;
  growth: string;
  icon: string;
  color: string;
}

export const generateCurrentMetrics = (): Metric[] => {
  const followers = Math.floor(Math.random() * 5000) + 1000;
  const engagement = (Math.random() * 3 + 1).toFixed(1);
  const reach = Math.floor(Math.random() * 10000) + 2000;
  const leads = Math.floor(Math.random() * 50) + 10;

  return [
    {
      name: "Seguidores",
      current: followers.toLocaleString(),
      projected: Math.floor(followers * 1.5).toLocaleString(),
      growth: "+50%",
      icon: "Target",
      color: "text-blue-400"
    },
    {
      name: "Engajamento",
      current: `${engagement}%`,
      projected: `${(parseFloat(engagement) * 1.3).toFixed(1)}%`,
      growth: "+30%",
      icon: "TrendingUp",
      color: "text-green-400"
    },
    {
      name: "Alcance",
      current: reach.toLocaleString(),
      projected: Math.floor(reach * 2).toLocaleString(),
      growth: "+100%",
      icon: "BarChart3",
      color: "text-purple-400"
    },
    {
      name: "Leads",
      current: leads.toString(),
      projected: Math.floor(leads * 2.5).toString(),
      growth: "+150%",
      icon: "Target",
      color: "text-orange-400"
    }
  ];
};

export const generateProjectedMetrics = (currentMetrics: Metric[]): Metric[] => {
  return currentMetrics.map(metric => ({
    ...metric,
    current: metric.projected,
    projected: metric.projected
  }));
};

export const kpis: Array<{
  name: string;
  current: string;
  target: string;
  status: string;
  icon: KPIIconType;
}> = [
  {
    name: "Taxa de Conversão",
    current: "2.5%",
    target: "4.0%",
    status: "improvement",
    icon: "Target" as const
  },
  {
    name: "Custo por Lead",
    current: "R$ 45",
    target: "R$ 30",
    status: "improvement",
    icon: "TrendingUp" as const
  },
  {
    name: "ROI Marketing",
    current: "180%",
    target: "250%",
    status: "improvement", 
    icon: "TrendingUp" as const
  },
  {
    name: "Tempo Médio de Conversão",
    current: "7 dias",
    target: "5 dias",
    status: "improvement",
    icon: "Calendar" as const
  }
];

export const engagementMetrics: Array<{
  name: string;
  value: string;
  growth: string;
  icon: EngagementIconType;
  color: string;
}> = [
  { name: "Curtidas", value: "1.2K", growth: "+15%", icon: "Heart" as const, color: "text-red-400" },
  { name: "Comentários", value: "89", growth: "+22%", icon: "MessageCircle" as const, color: "text-blue-400" },
  { name: "Compartilhamentos", value: "156", growth: "+8%", icon: "Share2" as const, color: "text-green-400" },
  { name: "Visualizações", value: "8.5K", growth: "+18%", icon: "Eye" as const, color: "text-purple-400" }
];
