
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Settings,
  LogOut,
  Dashboard,
  FileText,
  Award,
  Image,
  Book,
  Users,
  Instagram,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { usePermissions } from "@/hooks/use-permissions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ProfileMenu() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { isAdmin, canManageWorkspace, canViewConsultantPanel } = usePermissions();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro ao fazer logout",
        description: "Não foi possível desconectar. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const nameParts = name.split(" ");
    if (nameParts.length === 1) return nameParts[0][0]?.toUpperCase() || "U";
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  };

  const userInitials = getInitials(user?.nome || "");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.profilePhotoUrl || ""} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.nome}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
            {user?.role && (
              <p className="text-xs leading-none text-primary bg-primary/10 rounded px-1 py-0.5 mt-1 inline-block max-w-max">
                {user.role}
              </p>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Seção Meus Dados - scripts, diagnósticos, dashboard */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-semibold text-xs uppercase text-muted-foreground">
            Meus Dados
          </DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link to="/script-history">
              <FileText className="mr-2 h-4 w-4" />
              <span>Meus Roteiros</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/diagnostics-history">
              <Book className="mr-2 h-4 w-4" />
              <span>Meus Diagnósticos</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/profile-dashboard">
              <Dashboard className="mr-2 h-4 w-4" />
              <span>Minha Dashboard</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Seção Biblioteca do usuário */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-semibold text-xs uppercase text-muted-foreground">
            Minha Biblioteca
          </DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link to="/before-after">
              <Image className="mr-2 h-4 w-4" />
              <span>Fotos Antes/Depois</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/video-storage">
              <Video className="mr-2 h-4 w-4" />
              <span>Meus Vídeos</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/my-documents">
              <FileText className="mr-2 h-4 w-4" />
              <span>Meus Documentos</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Seção Integrações */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-semibold text-xs uppercase text-muted-foreground">
            Integrações
          </DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link to="/integrations/instagram">
              <Instagram className="mr-2 h-4 w-4" />
              <span>Instagram</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Seção Progresso */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-semibold text-xs uppercase text-muted-foreground">
            Meu Progresso
          </DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link to="/gamification">
              <Award className="mr-2 h-4 w-4" />
              <span>Gamificação</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Seção de Configurações e Logout */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-semibold text-xs uppercase text-muted-foreground">
            Configurações
          </DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link to="/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </Link>
          </DropdownMenuItem>
          {canManageWorkspace() && (
            <DropdownMenuItem asChild>
              <Link to="/workspace-settings">
                <Users className="mr-2 h-4 w-4" />
                <span>Gerenciar Workspace</span>
              </Link>
            </DropdownMenuItem>
          )}
          {isAdmin() && (
            <DropdownMenuItem asChild>
              <Link to="/admin">
                <Settings className="mr-2 h-4 w-4" />
                <span>Administração</span>
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? "Saindo..." : "Sair"}</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
