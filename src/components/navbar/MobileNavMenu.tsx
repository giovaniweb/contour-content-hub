
import React from "react";
import { Link } from "react-router-dom";
import { usePermissions } from "@/hooks/use-permissions";
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
  Activity
} from "lucide-react";

interface MobileNavMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isAuthenticated: boolean;
}

export const MobileNavMenu: React.FC<MobileNavMenuProps> = ({
  isOpen,
  setIsOpen,
  isAuthenticated,
}) => {
  const { isAdmin } = usePermissions();

  if (!isAuthenticated) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="left" className="w-[80%] sm:w-[350px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col p-4 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
            onClick={() => setIsOpen(false)}
          >
            <Laptop className="h-5 w-5" />
            <span>Início</span>
          </Link>
          <Link
            to="/video-storage"
            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
            onClick={() => setIsOpen(false)}
          >
            <Database className="h-5 w-5" />
            <span>Biblioteca de Vídeos</span>
          </Link>
          <Link
            to="/video-swipe"
            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
            onClick={() => setIsOpen(false)}
          >
            <VideoIcon className="h-5 w-5" />
            <span>Descobrir Vídeos</span>
          </Link>
          <Link
            to="/media"
            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
            onClick={() => setIsOpen(false)}
          >
            <VideoIcon className="h-5 w-5" />
            <span>Biblioteca de Mídia</span>
          </Link>
          <Link
            to="/technical-documents"
            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
            onClick={() => setIsOpen(false)}
          >
            <FileText className="h-5 w-5" />
            <span>Documentos Técnicos</span>
          </Link>
          {isAdmin() && (
            <>
              <Link
                to="/admin/system-diagnostics"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-muted mt-4 border-t pt-4"
                onClick={() => setIsOpen(false)}
              >
                <Cog className="h-5 w-5" />
                <span>Admin</span>
              </Link>
              <Link
                to="/admin/system-diagnostics"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                <Activity className="h-5 w-5" />
                <span>Diagnóstico</span>
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
