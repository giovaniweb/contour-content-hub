import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Crown,
  BrainCircuit,
  PenTool,
  Video,
  Image,
  Palette,
  Wrench,
  BookOpen,
  X,
  User,
  Settings,
  LogOut,
  Lock,
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { usePermissions } from "@/hooks/use-permissions";
import { getFeatureFromPath } from "@/utils/featureMapping";
import { RestrictedAccessModal } from "@/components/access-control/RestrictedAccessModal";
import { FeatureBadge } from "@/components/access-control/FeatureBadge";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Crown, label: "FluiChat", path: "/mestre-da-beleza" },
  { icon: BrainCircuit, label: "FluiMKT", path: "/marketing-consultant" },
  { icon: PenTool, label: "FluiRoteiro", path: "/fluidaroteirista" },
  { icon: Video, label: "FluiVideos", path: "/videos" },
  { icon: Image, label: "FluiFotos", path: "/photos" },
  { icon: Palette, label: "FluiArtes", path: "/arts" },
  { icon: BookOpen, label: "FluiArtigos", path: "/scientific-articles" },
  { icon: GraduationCap, label: "FluiAulas", path: "/academia" },
  { icon: Wrench, label: "Equipamentos", path: "/equipments" },
];

const MobileSidebarMenu: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { open, setOpen } = useSidebar();
  const { hasAccess, getFeatureStatus, isNewFeature, markNotificationAsRead, notifications } = useFeatureAccess();
  const { isAdmin } = usePermissions();
  const [isAdminFlag, setIsAdminFlag] = useState(false);
  const [restrictedModal, setRestrictedModal] = useState<{
    isOpen: boolean;
    feature?: any;
  }>({ isOpen: false });

  // Resolve isAdmin() Promise to boolean state
  React.useEffect(() => {
    let mounted = true;
    isAdmin().then(result => {
      if (mounted) {
        setIsAdminFlag(result);
      }
    }).catch(() => {
      if (mounted) {
        setIsAdminFlag(false);
      }
    });
    
    return () => {
      mounted = false;
    };
  }, [isAdmin]);

  const handleNavigation = async (path: string) => {
    const feature = getFeatureFromPath(path);
    
    // Dashboard is always accessible, or admin has full access
    if (path === '/dashboard' || isAdminFlag) {
      navigate(path);
      setOpen(false);
      return;
    }

    if (feature) {
      const hasPermission = hasAccess(feature);
      
      if (hasPermission) {
        // Mark as read if it's a new feature
        if (isNewFeature(feature)) {
          const notification = notifications.find(n => n.feature === feature && !n.is_read);
          if (notification) {
            await markNotificationAsRead(notification.id);
          }
        }
        navigate(path);
        setOpen(false);
      } else {
        // Show restricted access modal
        setRestrictedModal({ isOpen: true, feature });
      }
    } else {
      // If no feature mapping, allow navigation (fallback)
      navigate(path);
      setOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-aurora-deep-navy via-aurora-card-bg to-aurora-deep-navy">
      {/* Header do sidebar */}
      <div className="p-4 border-b border-aurora-neon-blue/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.profilePhotoUrl} />
              <AvatarFallback className="bg-aurora-neon-blue/20 text-aurora-neon-blue">
                {user?.nome?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-medium text-sm">{user?.nome || "Usuário"}</p>
              <p className="text-aurora-text-muted text-xs">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
            className="text-aurora-text-muted hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Menu de navegação */}
      <div className="flex-1 py-4">
        <nav className="space-y-2 px-3">
          {sidebarItems.map((item) => {
            const active = location.pathname === item.path;
            
            // Check permissions for this item
            const feature = getFeatureFromPath(item.path);
            const featureStatus = feature ? getFeatureStatus(feature) : null;
            const hasPermission = item.path === '/dashboard' || isAdminFlag || (feature && hasAccess(feature));
            const isNew = feature && isNewFeature(feature);
            const isRestricted = feature && !hasPermission && !isAdminFlag;
            
            return (
              <button
                key={item.path}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-left relative",
                  "text-aurora-text-muted hover:text-aurora-neon-blue hover:bg-aurora-neon-blue/10",
                  active && "bg-aurora-neon-blue/20 text-aurora-neon-blue border border-aurora-neon-blue/30",
                  isRestricted && "opacity-60 cursor-not-allowed"
                )}
                onClick={() => handleNavigation(item.path)}
                disabled={isRestricted}
                title={isRestricted ? "Recurso bloqueado" : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium flex-1">{item.label}</span>
                
                {/* Status badge */}
                {featureStatus && featureStatus !== 'released' && (
                  <div className="flex-shrink-0">
                    <FeatureBadge status={featureStatus} variant="default" className="text-xs" />
                  </div>
                )}
                
                {/* New feature badge */}
                {isNew && !featureStatus && (
                  <span className="bg-gradient-to-r from-aurora-electric-purple to-aurora-neon-blue text-white text-[0.6rem] px-1.5 py-0.5 rounded-full font-bold leading-none">
                    Novo
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer com ações do usuário */}
      <div className="p-4 border-t border-aurora-neon-blue/20 space-y-2">
        <button
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-aurora-text-muted hover:text-aurora-neon-blue hover:bg-aurora-neon-blue/10 transition-all"
          onClick={() => handleNavigation("/profile")}
        >
          <User className="w-5 h-5" />
          <span className="text-sm">Perfil</span>
        </button>
        
        <button
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-aurora-text-muted hover:text-aurora-neon-blue hover:bg-aurora-neon-blue/10 transition-all"
          onClick={() => handleNavigation("/settings")}
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm">Configurações</span>
        </button>
        
        <Separator className="bg-aurora-neon-blue/20" />
        
        <button
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Sair</span>
        </button>
      </div>

      {/* Restricted Access Modal */}
      <RestrictedAccessModal 
        isOpen={restrictedModal.isOpen}
        onClose={() => setRestrictedModal({ isOpen: false })}
        feature={restrictedModal.feature}
      />
    </div>
  );
};

export default MobileSidebarMenu;