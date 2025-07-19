
import React from "react";
import { Link } from "react-router-dom";
import { usePermissions } from "@/hooks/use-permissions";
import { ROUTES } from "@/routes";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Laptop,
  Database,
  FileText,
  Cog,
  VideoIcon,
  Activity,
  LayoutDashboard,
  BrainCircuit,
  CheckCircle,
  Calendar,
  Lightbulb,
  Images,
  FilePlus,
  BookText,
  LineChart,
  Wrench,
  BarChart3,
  PuzzleIcon,
  PenTool,
  Settings,
  Globe,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface MobileNavMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  onLogout?: () => void;
}

export const MobileNavMenu: React.FC<MobileNavMenuProps> = ({
  isOpen,
  setIsOpen,
  isAuthenticated,
  onLogout,
}) => {
  const { isAdmin } = usePermissions();

  if (!isAuthenticated) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="left" className="w-[80%] sm:w-[350px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col p-4 overflow-y-auto h-full">
          <div className="flex-1 space-y-2">
            <Link
              to={ROUTES.DASHBOARD}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              to={ROUTES.VIDEOS.ROOT}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              <VideoIcon className="h-5 w-5" />
              <span>Vídeos</span>
            </Link>
            <Link
              to={ROUTES.MARKETING.CONSULTANT}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              <BrainCircuit className="h-5 w-5" />
              <span>Consultor Fluida</span>
            </Link>
            <Link
              to={ROUTES.CONTENT.STRATEGY}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              <LineChart className="h-5 w-5" />
              <span>Estratégia</span>
            </Link>
            <Link
              to={ROUTES.CONTENT.PLANNER}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              <FileText className="h-5 w-5" />
              <span>Planner</span>
            </Link>
            <Link
              to={ROUTES.CONTENT.IDEAS}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              <Lightbulb className="h-5 w-5" />
              <span>Ideias</span>
            </Link>
            <Link
              to={ROUTES.CONTENT.SCRIPTS.ROOT}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              <PenTool className="h-5 w-5" />
              <span>Roteiros</span>
            </Link>
            <Link
              to={ROUTES.MEDIA}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              <Images className="h-5 w-5" />
              <span>Biblioteca de Mídia</span>
            </Link>
            <Link
              to={ROUTES.CONTENT.CALENDAR}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              <Calendar className="h-5 w-5" />
              <span>Agenda</span>
            </Link>
            <Link
              to={ROUTES.EQUIPMENTS.LIST}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              <Wrench className="h-5 w-5" />
              <span>Equipamentos</span>
            </Link>
            
            {isAdmin() && (
              <>
                <Separator className="my-2" />
                <Link
                  to={ROUTES.ADMIN.ROOT}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
                  onClick={() => setIsOpen(false)}
                >
                  <Cog className="h-5 w-5" />
                  <span>Administração</span>
                </Link>
                <Link
                  to={ROUTES.ADMIN_VIDEOS.ROOT}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
                  onClick={() => setIsOpen(false)}
                >
                  <VideoIcon className="h-5 w-5" />
                  <span>Gerenciar Vídeos</span>
                </Link>
                <Link
                  to={ROUTES.ADMIN_VIDEOS.BATCH}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
                  onClick={() => setIsOpen(false)}
                >
                  <FilePlus className="h-5 w-5" />
                  <span>Lote de Vídeos</span>
                </Link>
                <Link
                  to={ROUTES.ADMIN_VIDEOS.IMPORT}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
                  onClick={() => setIsOpen(false)}
                >
                  <Database className="h-5 w-5" />
                  <span>Importar Vídeos</span>
                </Link>
              </>
            )}
          </div>
          
          <div className="mt-auto space-y-2 pt-4 border-t">
            <div className="p-2">
              <div className="text-sm font-medium mb-2">Idioma</div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1 p-2 h-auto"
                >
                  <span className="text-lg">🇧🇷</span>
                  <span className="text-xs">PT</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1 p-2 h-auto"
                >
                  <span className="text-lg">🇺🇸</span>
                  <span className="text-xs">EN</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1 p-2 h-auto"
                >
                  <span className="text-lg">🇪🇸</span>
                  <span className="text-xs">ES</span>
                </Button>
              </div>
            </div>
            
            <Button
              variant="ghost"
              className="flex w-full items-center gap-3 p-2 justify-start"
              onClick={() => {
                setIsOpen(false);
                onLogout && onLogout();
              }}
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavMenu;
