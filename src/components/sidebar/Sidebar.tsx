import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import { 
  Home, 
  Kanban, 
  CalendarPlus, 
  FileText, 
  Video, 
  Images,
  Settings, 
  Menu,
  Lightbulb, 
  BookText,
  PenTool,
  FilePlus,
  LayoutDashboard,
  Database,
  LineChart,
  BarChart3,
  Cog,
  BrainCircuit,
  PuzzleIcon,
  Wrench
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const { open, setOpen } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  
  // Navigation structure
  const navigationGroups = [
    {
      label: "Main",
      items: [
        { 
          name: 'Dashboard', 
          path: '/dashboard', 
          icon: Home 
        },
        { 
          name: 'Planner', 
          path: '/content-planner', 
          icon: Kanban
        },
        { 
          name: 'Idea Validator', 
          path: '/idea-validator', 
          icon: Lightbulb,
          highlight: true
        },
        { 
          name: 'Scripts', 
          path: '/custom-gpt', 
          icon: PenTool 
        },
        { 
          name: 'Content', 
          path: '/content-strategy', 
          icon: FileText 
        },
      ]
    },
    {
      label: "Library",
      items: [
        {
          name: 'Videos',
          path: '/videos',
          icon: Video
        },
        {
          name: 'Media Library',
          path: '/media-library',
          icon: Images,
          highlight: true
        },
        {
          name: 'Media Files',
          path: '/technical-documents',
          icon: FilePlus
        }
      ]
    },
    {
      label: "Scientific",
      items: [
        {
          name: 'Articles',
          path: '/scientific-articles',
          icon: BookText
        }
      ]
    },
    {
      label: "Strategy",
      items: [
        {
          name: 'Strategy',
          path: '/marketing-consultant',
          icon: LineChart
        },
        {
          name: 'Agenda',
          path: '/calendar',
          icon: CalendarPlus
        },
        {
          name: 'Equipment',
          path: '/equipments',
          icon: Wrench
        }
      ]
    }
  ];
  
  // Admin navigation items (only shown to admin users)
  const adminItems = [
    { 
      name: 'Admin Panel', 
      path: '/admin/dashboard', 
      icon: LayoutDashboard 
    },
    { 
      name: 'Integrations', 
      path: '/admin/integrations', 
      icon: PuzzleIcon 
    },
    { 
      name: 'System Diagnostics', 
      path: '/admin/system-diagnostics', 
      icon: Database 
    },
    { 
      name: 'AI Panel', 
      path: '/admin/system-intelligence', 
      icon: BrainCircuit 
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: Cog 
    },
  ];
  
  // Check if the current path is active
  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') {
      return true;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <SidebarComponent collapsible="icon">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center justify-between">
          {open && (
            <div className="font-semibold text-xl fluida-gradient-text">
              Fluida
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-auto"
            onClick={() => setOpen(!open)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-2 overflow-y-auto">
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.label} className="mb-4">
            <SidebarGroupLabel className={cn(!open && "sr-only")}>
              {group.label}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    active={isActive(item.path)}
                    collapsible
                    className={item.highlight ? "relative fluida-gradient-border z-10" : ""}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                      {item.highlight && open && (
                        <span className="absolute right-2 top-1 h-2 w-2 rounded-full bg-fluida-pink animate-pulse" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
        
        {user?.role === 'admin' && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className={cn(!open && "sr-only", "flex items-center")}>
              <Cog className="mr-2 h-4 w-4" /> Admin
            </SidebarGroupLabel>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    active={isActive(item.path)}
                    collapsible
                  >
                    <Link to={item.path}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      
      <SidebarFooter className="border-t p-4">
        {open ? (
          <div className="text-xs text-muted-foreground">
            Fluida © {new Date().getFullYear()}
          </div>
        ) : null}
      </SidebarFooter>
    </SidebarComponent>
  );
}
