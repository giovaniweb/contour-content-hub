
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
  BrainCircuit
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
            to="/dashboard"
            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
            onClick={() => setIsOpen(false)}
          >
            <Laptop className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/equipments"
            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
            onClick={() => setIsOpen(false)}
          >
            <Database className="h-5 w-5" />
            <span>Equipamentos</span>
          </Link>
          <Link
            to="/custom-gpt"
            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
            onClick={() => setIsOpen(false)}
          >
            <FileText className="h-5 w-5" />
            <span>Roteiros</span>
          </Link>
          <Link
            to="/media"
            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
            onClick={() => setIsOpen(false)}
          >
            <VideoIcon className="h-5 w-5" />
            <span>Mídias</span>
          </Link>
          <Link
            to="/marketing-consultant"
            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
            onClick={() => setIsOpen(false)}
          >
            <BrainCircuit className="h-5 w-5" />
            <span>Consultor de Marketing</span>
          </Link>
          {isAdmin() && (
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              <Cog className="h-5 w-5" />
              <span>Admin</span>
            </Link>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
