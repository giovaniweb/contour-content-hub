import React from "react";
import Navbar from "./Navbar";
import { useAuth } from "@/context/AuthContext";
import Footer from "./footer/Footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/sidebar/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, fullWidth = false }) => {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <div className="flex min-h-screen flex-col">
      {isAuthenticated ? (
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <Sidebar />
            <div className="flex flex-1 flex-col">
              <Navbar />
              <main className={`flex-1 ${!fullWidth && "container"}`}>
                {children}
              </main>
              <Footer />
            </div>
          </div>
        </SidebarProvider>
      ) : (
        <>
          <Navbar />
          <main className={`flex-1 ${!fullWidth && "container"}`}>
            {children}
          </main>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Layout;
