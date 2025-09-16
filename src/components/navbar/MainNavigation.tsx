
import React, { useState } from "react";
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
  Users,
  Image as ImageIcon,
  GraduationCap,
  Wrench,
  Palette,
  BookOpen,
  Camera
} from "lucide-react";
import FeatureAccessControl from "@/components/access-control/FeatureAccessControl";
import RestrictedAccessModal from "@/components/access-control/RestrictedAccessModal";
import { AppFeature } from "@/hooks/useFeatureAccess";

interface MainNavigationProps {
  isAuthenticated: boolean;
}

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  feature?: AppFeature;
}

export const MainNavigation: React.FC<MainNavigationProps> = ({ isAuthenticated }) => {
  const { isAdmin, canViewConsultantPanel } = usePermissions();
  const location = useLocation();
  const [restrictedModalOpen, setRestrictedModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<AppFeature | null>(null);
  
  if (!isAuthenticated) return null;

  const handleRestrictedClick = (feature: AppFeature) => {
    setSelectedFeature(feature);
    setRestrictedModalOpen(true);
  };

  // Define navigation items with access control
  const navItems: NavItem[] = [
    { to: ROUTES.DASHBOARD, icon: <LayoutDashboard size={16} />, label: "Dashboard" },
    { to: ROUTES.CONTENT.PLANNER, icon: <Kanban size={16} />, label: "Planner", feature: "planner" },
    { to: ROUTES.CONTENT.IDEAS, icon: <Lightbulb size={16} />, label: "Ideas", feature: "ideas" },
    { to: ROUTES.CONTENT.SCRIPTS.ROOT, icon: <PenTool size={16} />, label: "Scripts", feature: "fluida_roteirista" },
    { to: ROUTES.VIDEOS.ROOT, icon: <VideoIcon size={16} />, label: "Videos", feature: "videos" },
    { to: "/photos", icon: <ImageIcon size={16} />, label: "Fotos", feature: "fotos" },
    { to: ROUTES.MEDIA, icon: <Palette size={16} />, label: "Artes", feature: "artes" },
    { to: ROUTES.SCIENTIFIC_ARTICLES, icon: <BookOpen size={16} />, label: "Artigos", feature: "artigos_cientificos" },
    { to: ROUTES.ACADEMIA, icon: <GraduationCap size={16} />, label: "Academia", feature: "academia" },
    { to: ROUTES.EQUIPMENTS.LIST, icon: <Wrench size={16} />, label: "Equipamentos", feature: "equipamentos" },
    { to: ROUTES.BEFORE_AFTER, icon: <Camera size={16} />, label: "Antes/Depois", feature: "fotos_antes_depois" },
    { to: ROUTES.MESTRE_BELEZA, icon: <BrainCircuit size={16} />, label: "Mestre Beleza", feature: "mestre_beleza" },
    { to: ROUTES.MARKETING.CONSULTANT, icon: <BrainCircuit size={16} />, label: "Consultor", feature: "consultor_mkt" },
    { to: ROUTES.MARKETING.REPORTS, icon: <BarChart3 size={16} />, label: "Reports", feature: "reports" }
  ];

  return (
    <>
      <div className="flex items-center space-x-1">
        {navItems.map(({ to, icon, label, feature }) => {
          const navContent = (
            <NavLink 
              to={to} 
              icon={icon} 
              label={label}
            />
          );

          if (feature) {
            return (
              <FeatureAccessControl
                key={to}
                feature={feature}
                onRestrictedClick={() => handleRestrictedClick(feature)}
              >
                {navContent}
              </FeatureAccessControl>
            );
          }

          return (
            <div key={to}>
              {navContent}
            </div>
          );
        })}
        
        {canViewConsultantPanel() && (
          <NavLink to={ROUTES.CONSULTANT.PANEL} icon={<Users size={16} />} label="Clientes" />
        )}
        
        {isAdmin() && (
          <NavLink to={ROUTES.ADMIN.ROOT} icon={<Cog size={16} />} label="Admin" />
        )}
      </div>

      <RestrictedAccessModal
        isOpen={restrictedModalOpen}
        onClose={() => setRestrictedModalOpen(false)}
        feature={selectedFeature || 'academia'}
      />
    </>
  );
};

export default MainNavigation;
