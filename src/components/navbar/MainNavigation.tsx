
import React from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "./NavLink";
import { usePermissions } from "@/hooks/use-permissions";
import { 
  FileText, 
  LayoutDashboard, 
  VideoIcon, 
  Cog, 
  Database, 
  Presentation, 
  BrainCircuit,
  Calendar 
} from "lucide-react";

interface MainNavigationProps {
  isAuthenticated: boolean;
}

export const MainNavigation: React.FC<MainNavigationProps> = ({ isAuthenticated }) => {
  const { isAdmin } = usePermissions();
  const location = useLocation();
  
  if (!isAuthenticated) return null;

  // Define navigation links based on authentication and roles
  return (
    <div className="flex items-center space-x-1">
      <NavLink to="/dashboard" icon={<LayoutDashboard size={16} />} label="Dashboard" />
      <NavLink to="/media" icon={<VideoIcon size={16} />} label="Mídias" />
      <NavLink to="/videos" icon={<Database size={16} />} label="Vídeos" />
      <NavLink to="/technical-documents" icon={<FileText size={16} />} label="Documentos" />
      <NavLink to="/custom-gpt" icon={<BrainCircuit size={16} />} label="Roteiros" />
      {isAdmin() && (
        <NavLink to="/admin/system-diagnostics" icon={<Cog size={16} />} label="Admin" />
      )}
    </div>
  );
};
