
import React from "react";
import { Link } from "react-router-dom";
import { usePermissions } from "@/hooks/use-permissions";
import { useLanguage } from "@/context/LanguageContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  FileText,
  Video,
  Calendar,
  Settings,
  Database,
  MessageSquare,
  Sparkles,
  Users
} from "lucide-react";

interface DashboardSidebarProps {
  collapsed?: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  collapsed = false,
}) => {
  const { isAdmin, isOperator } = usePermissions();
  const { t } = useLanguage();
  
  // Define menu items for all users
  const mainMenuItems = [
    {
      title: t('dashboard'),
      icon: LayoutDashboard,
      url: "/dashboard",
    },
    {
      title: t('scripts'),
      icon: FileText,
      url: "/script-generator",
    },
    {
      title: t('library'),
      icon: Video,
      url: "/media-library",
    },
    {
      title: t('agenda'),
      icon: Calendar,
      url: "/calendar",
    },
    {
      title: t('bigIdea'),
      icon: Sparkles,
      url: "/script-generator?type=bigIdea",
    },
  ];
  
  // Define menu items only for admins and operators
  const adminMenuItems = [
    {
      title: t('adminPanel'),
      icon: Settings,
      url: "/admin/integrations",
    },
    {
      title: "Cadastrar Conteúdo",
      icon: Database,
      url: "/admin/content",
    },
  ];

  return (
    <Sidebar variant="floating" collapsible={collapsed ? "icon" : "none"}>
      <SidebarHeader className="border-b py-4">
        <div className="px-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-contourline-mediumBlue rounded-full flex items-center justify-center">
            <span className="text-white font-bold">R</span>
          </div>
          {!collapsed && (
            <span className="font-bold text-lg text-contourline-mediumBlue">
              ReelLine
            </span>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild tooltip={collapsed ? item.title : undefined}>
                    <Link to={item.url}>
                      <item.icon className="text-contourline-darkBlue" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Admin Controls Section - Only visible to admins and operators */}
        {(isAdmin() || isOperator()) && (
          <SidebarGroup>
            <SidebarGroupLabel>Administração</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenuItems.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild tooltip={collapsed ? item.title : undefined}>
                      <Link to={item.url}>
                        <item.icon className="text-contourline-darkBlue" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        
        {/* Support Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Suporte</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={collapsed ? "Ajuda" : undefined}>
                  <Link to="/support">
                    <MessageSquare className="text-contourline-darkBlue" />
                    <span>Centro de Ajuda</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-contourline-mediumBlue" />
          {!collapsed && <span className="text-sm">Contourline</span>}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
