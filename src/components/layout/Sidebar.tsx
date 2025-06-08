
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from '@/routes';
import { motion } from 'framer-motion';
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
  Menu,
  User,
  HelpCircle,
  PlusCircle,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { sidebarData, adminItems } from "../sidebar/SidebarData";

export default function Sidebar() {
  const { open, setOpen } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  
  // Verificação mais robusta para admin
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  
  // Check if the current path is active
  const isActive = (path: string) => {
    if (path === ROUTES.DASHBOARD && (location.pathname === '/' || location.pathname === ROUTES.DASHBOARD)) {
      return true;
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 aurora-dark-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/50" />
      </div>
      
      {/* Animated particles overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <SidebarComponent className="bg-transparent border-r border-white/20 relative z-10">
        <SidebarHeader className="border-b border-white/20 p-6">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center shadow-lg"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400 via-blue-400 to-cyan-400 opacity-50 blur-md" />
              </motion.div>
              <div className={cn("transition-all duration-300", !open && "opacity-0 w-0 overflow-hidden")}>
                <div className="font-bold text-2xl text-white mb-1 drop-shadow-lg">
                  Fluida
                </div>
                <div className="text-xs text-white/80 font-medium">
                  Plataforma de Conteúdo
                </div>
              </div>
            </motion.div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto text-white hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-105"
              onClick={() => setOpen(!open)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </SidebarHeader>
        
        <SidebarContent className="p-4 overflow-y-auto scrollbar-hide">
          {/* Display all sidebar groups from our data */}
          {sidebarData.map((group, groupIndex) => (
            <SidebarGroup key={group.name} className="mb-8">
              <SidebarGroupLabel className={cn("text-sm font-bold text-white/90 uppercase tracking-widest mb-4 px-3 drop-shadow-md transition-all duration-300", !open && "opacity-0 h-0 overflow-hidden")}>
                {group.name}
              </SidebarGroupLabel>
              <SidebarMenu className="space-y-2">
                {group.links.map((item, itemIndex) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: (groupIndex * 0.1) + (itemIndex * 0.05),
                      ease: "easeOut"
                    }}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive(item.path)}
                        className={cn(
                          "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden min-h-[48px]",
                          "text-white hover:text-white",
                          isActive(item.path) 
                            ? "bg-gradient-to-r from-purple-500/30 to-blue-500/30 text-white shadow-lg backdrop-blur-sm border border-white/20" 
                            : "hover:bg-white/15 hover:backdrop-blur-sm text-white/85 hover:text-white",
                          item.highlight && "relative"
                        )}
                      >
                        <Link to={item.path} className="flex items-center gap-4 w-full">
                          {/* Gradient background for active items */}
                          {isActive(item.path) && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                          
                          {/* Icon with improved visibility */}
                          <div className={cn(
                            "relative flex-shrink-0 transition-all duration-300 flex items-center justify-center w-6 h-6",
                            isActive(item.path) && "drop-shadow-[0_0_8px_rgba(147,51,234,0.7)]"
                          )}>
                            <item.icon className="h-6 w-6 text-white" />
                          </div>
                          
                          {/* Text always visible */}
                          <span className={cn(
                            "flex-1 relative z-10 font-medium text-white transition-all duration-300",
                            !open && "opacity-0 w-0 overflow-hidden"
                          )}>
                            {item.name}
                          </span>
                          
                          {item.highlight && open && (
                            <motion.div
                              className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg flex-shrink-0"
                              animate={{ 
                                scale: [1, 1.3, 1], 
                                opacity: [0.7, 1, 0.7] 
                              }}
                              transition={{ 
                                duration: 2, 
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>
                ))}

                {/* Only add Create Video button to the Videos group */}
                {group.name === "Vídeos" && (
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: (groupIndex * 0.1) + (group.links.length * 0.05),
                      ease: "easeOut" 
                    }}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive(ROUTES.VIDEOS.CREATE)}
                        className={cn(
                          "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden min-h-[48px]",
                          "text-cyan-200 hover:text-cyan-100",
                          isActive(ROUTES.VIDEOS.CREATE) 
                            ? "bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-100 shadow-lg backdrop-blur-sm border border-cyan-400/30" 
                            : "hover:bg-cyan-500/15 hover:backdrop-blur-sm"
                        )}
                      >
                        <Link to={ROUTES.VIDEOS.CREATE} className="flex items-center gap-4 w-full">
                          <div className="relative flex-shrink-0 transition-all duration-300 flex items-center justify-center w-6 h-6">
                            <PlusCircle className="h-6 w-6 text-cyan-200" />
                          </div>
                          <span className={cn(
                            "flex-1 relative z-10 font-medium text-cyan-200 transition-all duration-300",
                            !open && "opacity-0 w-0 overflow-hidden"
                          )}>
                            Criar Vídeo
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>
                )}
              </SidebarMenu>
            </SidebarGroup>
          ))}
          
          {/* Admin menu - only show for admin users */}
          {isAdmin && (
            <SidebarGroup className="mt-8 pt-6 border-t border-white/20">
              <SidebarGroupLabel className={cn("text-sm font-bold text-orange-200 uppercase tracking-widest mb-4 px-3 drop-shadow-md transition-all duration-300", !open && "opacity-0 h-0 overflow-hidden")}>
                Administração
              </SidebarGroupLabel>
              <SidebarMenu className="space-y-2">
                {adminItems.map((item, itemIndex) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: itemIndex * 0.05,
                      ease: "easeOut" 
                    }}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive(item.path)}
                        className={cn(
                          "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden min-h-[48px]",
                          "text-orange-100 hover:text-orange-50",
                          isActive(item.path) 
                            ? "bg-gradient-to-r from-orange-500/30 to-red-500/30 text-orange-50 shadow-lg backdrop-blur-sm border border-orange-400/30" 
                            : "hover:bg-orange-500/15 hover:backdrop-blur-sm text-orange-200/85 hover:text-orange-100"
                        )}
                      >
                        <Link to={item.path} className="flex items-center gap-4 w-full">
                          <div className="relative flex-shrink-0 transition-all duration-300 flex items-center justify-center w-6 h-6">
                            <item.icon className="h-6 w-6 text-orange-100" />
                          </div>
                          <span className={cn(
                            "flex-1 relative z-10 font-medium text-orange-100 transition-all duration-300",
                            !open && "opacity-0 w-0 overflow-hidden"
                          )}>
                            {item.name}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          )}
        </SidebarContent>
        
        <SidebarFooter className="border-t border-white/20 p-4">
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              to={ROUTES.PROFILE} 
              className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold text-white hover:text-white hover:bg-white/15 transition-all duration-300 group min-h-[48px]"
            >
              <User className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
              <span className={cn(
                "flex-1 text-white transition-all duration-300",
                !open && "opacity-0 w-0 overflow-hidden"
              )}>
                Perfil
              </span>
            </Link>
            <Link 
              to="/help" 
              className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold text-white hover:text-white hover:bg-white/15 transition-all duration-300 group min-h-[48px]"
            >
              <HelpCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
              <span className={cn(
                "flex-1 text-white transition-all duration-300",
                !open && "opacity-0 w-0 overflow-hidden"
              )}>
                Ajuda
              </span>
            </Link>
          </motion.div>
        </SidebarFooter>
      </SidebarComponent>
    </div>
  );
}
