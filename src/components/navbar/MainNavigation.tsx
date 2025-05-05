
import React from "react";
import { useLocation } from "react-router-dom";
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { NavLink } from "./NavLink";
import { Home, FileText, CheckCircle, BookOpen, Film, ListTodo, CalendarDays, Package, Settings, LayoutDashboard, Link } from "lucide-react";
import { usePermissions } from "@/hooks/use-permissions";

interface MainNavigationProps {
  isAuthenticated: boolean;
}

export const MainNavigation: React.FC<MainNavigationProps> = ({ isAuthenticated }) => {
  const location = useLocation();
  const { isAdmin } = usePermissions();

  if (!isAuthenticated) return null;

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {/* Menu do Cliente */}
        <NavigationMenuItem>
          <NavLink 
            to="/dashboard"
            icon={<Home className="h-4 w-4 mr-2" aria-hidden="true" />}
            label="Início"
            isActive={location.pathname === "/dashboard"}
          />
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavLink 
            to="/custom-gpt"
            icon={<FileText className="h-4 w-4 mr-2" aria-hidden="true" />}
            label="Roteiros"
            isActive={location.pathname === "/custom-gpt"}
          />
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavLink 
            to="/validate-script"
            icon={<CheckCircle className="h-4 w-4 mr-2" aria-hidden="true" />}
            label="Validador"
            isActive={location.pathname === "/validate-script"}
          />
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavLink 
            to="/documents"
            icon={<BookOpen className="h-4 w-4 mr-2" aria-hidden="true" />}
            label="Artigos Científicos"
            isActive={location.pathname === "/documents"}
          />
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavLink 
            to="/media"
            icon={<Film className="h-4 w-4 mr-2" aria-hidden="true" />}
            label="Mídia"
            isActive={location.pathname === "/media"}
          />
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavLink 
            to="/content-strategy"
            icon={<ListTodo className="h-4 w-4 mr-2" aria-hidden="true" />}
            label="Estratégia de Conteúdo"
            isActive={location.pathname === "/content-strategy"}
            isNew={true}
          />
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavLink 
            to="/equipments"
            icon={<Package className="h-4 w-4 mr-2" aria-hidden="true" />}
            label="Equipamentos"
            isActive={location.pathname.startsWith("/equipments") && !location.pathname.startsWith("/admin")}
          />
        </NavigationMenuItem>
        
        {/* Menu do Admin */}
        {isAdmin() && (
          <NavigationMenuItem>
            <NavigationMenuTrigger className="h-9 px-4 py-2 text-sm">
              <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
              Admin
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-[220px] p-2">
                <NavLink 
                  to="/admin/dashboard"
                  icon={<LayoutDashboard className="h-4 w-4 mr-2" aria-hidden="true" />}
                  label="Painel Administrativo"
                  isActive={location.pathname === "/admin/dashboard"}
                />
                <NavLink 
                  to="/admin/equipments"
                  icon={<Package className="h-4 w-4 mr-2" aria-hidden="true" />}
                  label="Gerenciar Equipamentos"
                  isActive={location.pathname.startsWith("/admin/equipments") || location.pathname.startsWith("/admin/equipment/")}
                />
                <NavLink 
                  to="/admin/integrations"
                  icon={<Link className="h-4 w-4 mr-2" aria-hidden="true" />}
                  label="Integrações"
                  isActive={location.pathname === "/admin/integrations"}
                />
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
