
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar/sidebar-context";
import { SlideNotificationProvider } from "@/components/notifications/SlideNotificationProvider";

// Este é o layout principal da aplicação.
// O provedor de notificação foi adicionado para garantir que todos os componentes possam usar useSlideNotifications.
export const Main = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <SlideNotificationProvider>
      <div className="min-h-screen flex w-full">
        {children}
      </div>
    </SlideNotificationProvider>
  </SidebarProvider>
);
