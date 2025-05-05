
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavLink } from "./NavLink";
import { usePermissions } from "@/hooks/use-permissions";
import { 
  FileText, 
  LayoutGrid, 
  VideoIcon, 
  Cog, 
  Database, 
  Presentation, 
  BrainCircuit 
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
      <NavLink href="/dashboard" icon={<LayoutGrid size={16} />} label="Dashboard" />
      <NavLink href="/equipments" icon={<Database size={16} />} label="Equipamentos" />
      <NavLink href="/content-strategy" icon={<Presentation size={16} />} label="Conteúdo" />
      <NavLink href="/custom-gpt" icon={<FileText size={16} />} label="Roteiros" />
      <NavLink href="/media" icon={<VideoIcon size={16} />} label="Mídias" />
      <NavLink 
        href="/marketing-consultant" 
        icon={<BrainCircuit size={16} />} 
        label="Consultor" 
      />
      {isAdmin() && (
        <NavLink href="/admin/dashboard" icon={<Cog size={16} />} label="Admin" />
      )}
    </div>
  );
};
