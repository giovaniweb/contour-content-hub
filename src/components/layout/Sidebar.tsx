
import React, { useState, useEffect } from "react";
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
  GraduationCap,
  Bot,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { usePermissions } from "@/hooks/use-permissions";
import { getFeatureFromPath } from "@/utils/featureMapping";
import { RestrictedAccessModal } from "@/components/access-control/RestrictedAccessModal";
import { FeatureBadge } from "@/components/access-control/FeatureBadge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

const SIDEBAR_WIDTH = 96; // px (w-24 ~ 96px, more compact for smaller screens)

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { hasAccess, getFeatureStatus, isNewFeature, markNotificationAsRead, notifications } = useFeatureAccess();
  const { isAdmin } = usePermissions();
  const [isAdminFlag, setIsAdminFlag] = useState(false);
  const [restrictedModal, setRestrictedModal] = useState<{
    isOpen: boolean;
    feature?: any;
  }>({ isOpen: false });

  // Resolve isAdmin() Promise to boolean state
  useEffect(() => {
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

  // Ocultar sidebar no mobile
  if (isMobile) {
    return null;
  }

  const handleItemClick = async (path: string) => {
    const feature = getFeatureFromPath(path);
    
    console.log('🖱️ [Sidebar] Clique no item:', {
      path,
      feature,
      hasAccess: feature ? hasAccess(feature) : 'N/A',
      isAdmin: isAdminFlag
    });
    
    // Dashboard is always accessible, or admin has full access
    if (path === '/dashboard' || isAdminFlag) {
      console.log('✅ [Sidebar] Navegando para:', path);
      navigate(path);
      return;
    }

    if (feature) {
      const hasPermission = hasAccess(feature);
      
      console.log('🔍 [Sidebar] Verificação de permissão:', {
        feature,
        hasPermission,
        isAdmin: isAdminFlag
      });
      
      if (hasPermission) {
        // Mark as read if it's a new feature
        if (isNewFeature(feature)) {
          const notification = notifications.find(n => n.feature === feature && !n.is_read);
          if (notification) {
            await markNotificationAsRead(notification.id);
          }
        }
        console.log('✅ [Sidebar] Navegando para:', path);
        navigate(path);
      } else {
        // Show restricted access modal
        console.log('🚫 [Sidebar] Acesso negado, mostrando modal');
        setRestrictedModal({ isOpen: true, feature });
      }
    } else {
      // If no feature mapping, allow navigation (fallback)
      console.log('✅ [Sidebar] Navegando para (sem feature mapping):', path);
      navigate(path);
    }
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-gradient-to-b from-aurora-deep-navy via-aurora-card-bg to-aurora-deep-navy shadow-xl z-40 flex flex-col items-center py-4",
        "border-r border-aurora-neon-blue/20"
      )}
      style={{ width: SIDEBAR_WIDTH }}
    >
      {/* Menu */}
      <TooltipProvider>
        <nav className="flex-1 flex flex-col gap-2 w-full">
          {sidebarItems.map((item, index) => {
            const active = location.pathname === item.path;
            const labelLines = item.label.split('\n');
            const isLast = index === sidebarItems.length - 1;
            
            // Check permissions for this item
            const feature = getFeatureFromPath(item.path);
            const featureStatus = feature ? getFeatureStatus(feature) : null;
            const hasPermission = item.path === '/dashboard' || isAdminFlag || (feature && hasAccess(feature));
            const isNew = feature && isNewFeature(feature);
            const isRestricted = feature && !hasPermission && !isAdminFlag;
          
          // Debug log para cada item renderizado
          if (feature && index === 0) { // Log apenas uma vez por renderização
            console.log('🔍 [Sidebar] Estado dos itens:', {
              isAdmin: isAdminFlag,
              totalItems: sidebarItems.length,
              timestamp: new Date().toISOString()
            });
          }
          
          if (feature) {
            console.log(`🔍 [Sidebar] Item ${item.label}:`, {
              feature,
              hasPermission,
              isAdmin: isAdminFlag,
              isRestricted
            });
          }

            const tooltipMessage = 
              featureStatus === 'blocked' ? 'Recurso bloqueado - Entre em contato para liberar' :
              featureStatus === 'coming_soon' ? 'Recurso em breve - Aguarde liberação' :
              featureStatus === 'beta' ? 'Recurso em BETA - Pode apresentar erros' :
              null;

            return (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <button
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 text-aurora-text-muted hover:text-aurora-neon-blue hover:bg-aurora-neon-blue/10 rounded-lg transition-all duration-150 mx-auto w-[80px] py-2 group relative",
                      active && "bg-aurora-neon-blue/20 text-aurora-neon-blue shadow-lg border border-aurora-neon-blue/30",
                      !isLast && "after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-12 after:h-px after:bg-aurora-neon-blue/10",
                      isRestricted && "opacity-60 cursor-not-allowed"
                    )}
                    onClick={() => handleItemClick(item.path)}
                    tabIndex={0}
                    style={{ outline: "none" }}
                    disabled={isRestricted}
                  >
                    <div className="relative">
                      <item.icon className="w-5 h-5 mb-1" />
                      {isNew && (
                        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-aurora-electric-purple to-aurora-neon-blue text-white text-[0.6rem] px-1.5 py-0.5 rounded-full font-bold leading-none">
                          Novo
                        </span>
                      )}
                    </div>
                    
                    {/* Status badge no canto superior direito */}
                    {featureStatus && featureStatus !== 'released' && (
                      <div className="absolute -top-1 -right-1">
                        <FeatureBadge status={featureStatus} variant="compact" />
                      </div>
                    )}
                    
                    <span className={cn(
                      "text-[0.75rem] font-medium truncate leading-tight text-center break-words",
                      active && "text-aurora-neon-blue",
                      isRestricted && "text-aurora-text-muted"
                    )}>
                      {labelLines.map((line, idx) => (
                        <span key={idx} className="block">
                          {line}
                        </span>
                      ))}
                    </span>
                  </button>
                </TooltipTrigger>
                {tooltipMessage && (
                  <TooltipContent side="right">
                    <p>{tooltipMessage}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>
      </TooltipProvider>

      {/* Restricted Access Modal */}
      <RestrictedAccessModal 
        isOpen={restrictedModal.isOpen}
        onClose={() => setRestrictedModal({ isOpen: false })}
        feature={restrictedModal.feature}
      />
    </aside>
  );
};

export default Sidebar;
