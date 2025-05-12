
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
  Settings
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
            to={ROUTES.DASHBOARD}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
            onClick={() => setIsOpen(false)}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
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
            <span>Idea Validator</span>
          </Link>
          <Link
            to={ROUTES.CONTENT.SCRIPTS.ROOT}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
            onClick={() => setIsOpen(false)}
          >
            <PenTool className="h-5 w-5" />
            <span>Scripts</span>
          </Link>
          <Link
            to={ROUTES.VIDEOS.ROOT}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
            onClick={() => setIsOpen(false)}
          >
            <VideoIcon className="h-5 w-5" />
            <span>Videos</span>
          </Link>
          <Link
            to={ROUTES.MEDIA}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
            onClick={() => setIsOpen(false)}
          >
            <Images className="h-5 w-5" />
            <span>Media Library</span>
          </Link>
          <Link
            to="/media-files"
            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
            onClick={() => setIsOpen(false)}
          >
            <FilePlus className="h-5 w-5" />
            <span>Media Files</span>
          </Link>
          <Link
            to={ROUTES.CONTENT.STRATEGY}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
            onClick={() => setIsOpen(false)}
          >
            <LineChart className="h-5 w-5" />
            <span>Strategy</span>
          </Link>
          <Link
            to={ROUTES.SCIENTIFIC_ARTICLES}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
            onClick={() => setIsOpen(false)}
          >
            <BookText className="h-5 w-5" />
            <span>Articles</span>
          </Link>
          <Link
            to={ROUTES.MARKETING.REPORTS}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
            onClick={() => setIsOpen(false)}
          >
            <BarChart3 className="h-5 w-5" />
            <span>Reports</span>
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
            to={ROUTES.EQUIPMENT.LIST}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
            onClick={() => setIsOpen(false)}
          >
            <Wrench className="h-5 w-5" />
            <span>Equipment</span>
          </Link>
          {isAdmin() && (
            <>
              <Link
                to={ROUTES.ADMIN.ROOT}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-muted mt-4 border-t pt-4"
                onClick={() => setIsOpen(false)}
              >
                <Cog className="h-5 w-5" />
                <span>Admin</span>
              </Link>
              <Link
                to={ROUTES.ADMIN.SYSTEM.DIAGNOSTICS}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                <Activity className="h-5 w-5" />
                <span>Diagnostics</span>
              </Link>
              <Link
                to={ROUTES.ADMIN.AI}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                <BrainCircuit className="h-5 w-5" />
                <span>AI Panel</span>
              </Link>
              <Link
                to="/integrations"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                <PuzzleIcon className="h-5 w-5" />
                <span>Integrations</span>
              </Link>
              <Link
                to={ROUTES.WORKSPACE_SETTINGS}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavMenu;
