
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
  BrainCircuit,
  Calendar, 
  Kanban,
  Lightbulb,
  PenTool,
  BarChart3
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
      <NavLink to="/content-planner" icon={<Kanban size={16} />} label="Planner" />
      <NavLink to="/content-ideas" icon={<Lightbulb size={16} />} label="Ideas" />
      <NavLink to="/scripts" icon={<PenTool size={16} />} label="Scripts" />
      <NavLink to="/videos" icon={<VideoIcon size={16} />} label="Videos" />
      <NavLink to="/reports" icon={<BarChart3 size={16} />} label="Reports" />
      {isAdmin() && (
        <NavLink to="/admin" icon={<Cog size={16} />} label="Admin" />
      )}
    </div>
  );
};
