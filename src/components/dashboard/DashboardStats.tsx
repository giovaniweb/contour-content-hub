
import React from "react";
import { 
  FileText, 
  Film, 
  Users, 
  Calendar 
} from "lucide-react";

interface StatItem {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
}

const DashboardStats: React.FC = () => {
  // Estatísticas de exemplo - em uma implementação real, estes viriam de uma API
  const stats: StatItem[] = [
    {
      title: "Roteiros criados",
      value: 24,
      change: 12,
      icon: <FileText className="h-4 w-4" />
    },
    {
      title: "Vídeos produzidos",
      value: 18,
      change: 8,
      icon: <Film className="h-4 w-4" />
    },
    {
      title: "Alcance",
      value: "2.4k",
      change: 22,
      icon: <Users className="h-4 w-4" />
    },
    {
      title: "Eventos agendados",
      value: 9,
      change: -3,
      icon: <Calendar className="h-4 w-4" />
    }
  ];
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="p-4 rounded-lg bg-gray-50 flex flex-col"
        >
          <div className="flex items-center text-gray-500 mb-1">
            {stat.icon}
            <span className="text-xs ml-1">{stat.title}</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-semibold text-gray-800">
              {stat.value}
            </span>
            <span className={`ml-2 text-xs ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change >= 0 ? '+' : ''}{stat.change}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
