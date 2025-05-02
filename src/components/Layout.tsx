
import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "./Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter, 
  SidebarGroupLabel, 
  SidebarGroup, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarSeparator
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  History, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  FileSearch,
  Home,
  Calendar,
  Film,
  Settings,
  LayoutDashboard,
  User,
  Users,
  Settings2
} from "lucide-react";
import { usePermissions } from "@/hooks/use-permissions";

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  title?: string;
  fullWidth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  requireAuth = true,
  title,
  fullWidth = false
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { isAdmin, isOperator } = usePermissions();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);

  // Gerenciar estado do sidebar com base no tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animação de carregamento melhorada com aria-live para acessibilidade
  if (isLoading) {
    return (
      <div 
        className="flex items-center justify-center min-h-screen bg-gradient-to-r from-contourline-lightGray to-white"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="flex flex-col items-center space-y-6">
          <div className="relative" role="status">
            <div className="h-20 w-20 border-4 border-contourline-mediumBlue border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-10 w-10 bg-contourline-lightBlue/30 rounded-full animate-pulse" aria-hidden="true"></div>
            </div>
            <span className="sr-only">Carregando...</span>
          </div>
          <div className="text-center space-y-2">
            <p className="text-contourline-darkBlue font-heading font-medium text-xl">Carregando Fluida...</p>
            <p className="text-contourline-mediumBlue text-sm animate-pulse">Tô tirando do forno...</p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if auth is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <SidebarProvider defaultOpen={!sidebarCollapsed}>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-contourline-lightGray/20 w-full">
        <Navbar />
        
        <div className="flex flex-1">
          {isAuthenticated && (
            <Sidebar collapsible="icon">
              <SidebarHeader className="border-b pb-2">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center">
                    <Home className="h-5 w-5 mr-2 text-contourline-mediumBlue" aria-hidden="true" />
                    <span className="font-medium">Menu Principal</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0 rounded-full"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    aria-label={sidebarCollapsed ? "Expandir barra lateral" : "Recolher barra lateral"}
                  >
                    {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                  </Button>
                </div>
              </SidebarHeader>
              <SidebarContent>
                {/* Menu principal */}
                <SidebarGroup>
                  <SidebarGroupLabel>Navegação</SidebarGroupLabel>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/dashboard" className="flex items-center">
                          <LayoutDashboard className="h-4 w-4 mr-2 text-contourline-mediumBlue" aria-hidden="true" />
                          <span>Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/script-generator" className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-contourline-mediumBlue" aria-hidden="true" />
                          <span>Criar Roteiro</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/script-history" className="flex items-center">
                          <History className="h-4 w-4 mr-2 text-contourline-mediumBlue" aria-hidden="true" />
                          <span>Histórico de Roteiros</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/media-library" className="flex items-center">
                          <Film className="h-4 w-4 mr-2 text-contourline-mediumBlue" aria-hidden="true" />
                          <span>Biblioteca de Mídia</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/calendar" className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-contourline-mediumBlue" aria-hidden="true" />
                          <span>Agenda Inteligente</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/equipment-details" className="flex items-center">
                          <FileSearch className="h-4 w-4 mr-2 text-contourline-mediumBlue" aria-hidden="true" />
                          <span>Equipamentos</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroup>

                {/* Área Administrativa - visível apenas para admins e operadores */}
                {(isAdmin() || isOperator()) && (
                  <>
                    <SidebarSeparator />
                    <SidebarGroup>
                      <SidebarGroupLabel>Administração</SidebarGroupLabel>
                      <SidebarMenu>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild>
                            <Link to="/admin/dashboard" className="flex items-center">
                              <LayoutDashboard className="h-4 w-4 mr-2 text-contourline-mediumBlue" aria-hidden="true" />
                              <span>Painel Admin</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild>
                            <Link to="/admin/equipments" className="flex items-center">
                              <Settings2 className="h-4 w-4 mr-2 text-contourline-mediumBlue" aria-hidden="true" />
                              <span>Gerenciar Equipamentos</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild>
                            <Link to="/admin/content" className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-contourline-mediumBlue" aria-hidden="true" />
                              <span>Gerenciar Conteúdo</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild>
                            <Link to="/admin/integrations" className="flex items-center">
                              <Settings className="h-4 w-4 mr-2 text-contourline-mediumBlue" aria-hidden="true" />
                              <span>Integrações</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        {isAdmin() && (
                          <>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild>
                                <Link to="/seller/clients" className="flex items-center">
                                  <Users className="h-4 w-4 mr-2 text-contourline-mediumBlue" aria-hidden="true" />
                                  <span>Gerenciar Clientes</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild>
                                <Link to="/seller/dashboard" className="flex items-center">
                                  <User className="h-4 w-4 mr-2 text-contourline-mediumBlue" aria-hidden="true" />
                                  <span>Painel de Vendedor</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </>
                        )}
                      </SidebarMenu>
                    </SidebarGroup>
                  </>
                )}
              </SidebarContent>
              <SidebarFooter className="border-t pt-2">
                <div className="text-xs text-muted-foreground p-2 text-center">
                  Fluida © {new Date().getFullYear()}
                </div>
              </SidebarFooter>
            </Sidebar>
          )}
          
          <ScrollArea className="flex-grow">
            <main id="main-content" className={`mx-auto px-4 py-6 ${fullWidth ? 'w-full' : 'container'}`}>
              {title && (
                <h1 className="text-2xl md:text-3xl font-heading font-bold mb-6 text-contourline-gradient bg-clip-text text-transparent">
                  {title}
                </h1>
              )}
              <div className="animate-fade-in">
                {children}
              </div>
            </main>
          </ScrollArea>
        </div>
        
        <footer className="py-4 px-6 bg-white border-t border-contourline-lightBlue/10 text-center text-sm text-contourline-darkBlue">
          <p>© {new Date().getFullYear()} Fluida | Seu estúdio criativo, em um clique.</p>
        </footer>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
