
import React from "react";
import { useLocation } from "react-router-dom";
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { NavLink } from "./NavLink";
import { Home, FileText, CheckCircle, BookOpen, Film, ListTodo, CalendarDays } from "lucide-react";

interface MainNavigationProps {
  isAuthenticated: boolean;
}

export const MainNavigation: React.FC<MainNavigationProps> = ({ isAuthenticated }) => {
  const location = useLocation();

  if (!isAuthenticated) return null;

  return (
    <NavigationMenu>
      <NavigationMenuList>
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
            to="/admin/equipments"
            icon={<CalendarDays className="h-4 w-4 mr-2" aria-hidden="true" />}
            label="Equipamentos"
            isActive={location.pathname.includes("/admin/equipments")}
          />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
