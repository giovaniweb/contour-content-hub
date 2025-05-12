
import React from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "./NavLink";
import { usePermissions } from "@/hooks/use-permissions";
import { ROUTES } from "@/routes";
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
  BarChart3,
  Users
} from "lucide-react";

interface MainNavigationProps {
  isAuthenticated: boolean;
}

export const MainNavigation: React.FC<MainNavigationProps> = ({ isAuthenticated }) => {
  const { isAdmin, canViewConsultantPanel } = usePermissions();
  const location = useLocation();
  
  if (!isAuthenticated) return null;

  // Define navigation links based on authentication and roles
  return (
    <div className="flex items-center space-x-1">
      <NavLink to={ROUTES.DASHBOARD} icon={<LayoutDashboard size={16} />} label="Dashboard" />
      <NavLink to={ROUTES.CONTENT.PLANNER} icon={<Kanban size={16} />} label="Planner" />
      <NavLink to={ROUTES.CONTENT.IDEAS} icon={<Lightbulb size={16} />} label="Ideas" />
      <NavLink to={ROUTES.CONTENT.SCRIPTS.ROOT} icon={<PenTool size={16} />} label="Scripts" />
      <NavLink to={ROUTES.VIDEOS.ROOT} icon={<VideoIcon size={16} />} label="Videos" />
      <NavLink to={ROUTES.MARKETING.REPORTS} icon={<BarChart3 size={16} />} label="Reports" />
      {canViewConsultantPanel() && (
        <NavLink to={ROUTES.CONSULTANT.PANEL} icon={<Users size={16} />} label="Clientes" />
      )}
      {isAdmin() && (
        <NavLink to={ROUTES.ADMIN.ROOT} icon={<Cog size={16} />} label="Admin" />
      )}
    </div>
  );
};

export default MainNavigation;
