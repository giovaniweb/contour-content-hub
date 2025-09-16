
import React from "react";
import { 
  FileText, 
  Film, 
  Download, 
  Camera 
} from "lucide-react";
import { useRealUserDashboardStats } from "@/hooks/useRealUserDashboardStats";

interface StatItem {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
}

const DashboardStats: React.FC = () => {
  const { data: userStats, isLoading } = useRealUserDashboardStats();

  const stats: StatItem[] = [
    {
      title: "Roteiros criados",
      value: isLoading ? "..." : userStats?.totalScripts || 0,
      change: 0, // Could calculate based on previous period if needed
      icon: <FileText className="h-4 w-4" />
    },
    {
      title: "Vídeos assistidos",
      value: isLoading ? "..." : userStats?.totalVideosWatched || 0,
      change: 0,
      icon: <Film className="h-4 w-4" />
    },
    {
      title: "Downloads realizados",
      value: isLoading ? "..." : userStats?.totalDownloads || 0,
      change: 0,
      icon: <Download className="h-4 w-4" />
    },
    {
      title: "Fotos enviadas",
      value: isLoading ? "..." : userStats?.totalPhotosUploaded || 0,
      change: 0,
      icon: <Camera className="h-4 w-4" />
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
