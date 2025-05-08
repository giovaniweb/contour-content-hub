
import React from "react";
import Navbar from "./Navbar";
import { useAuth } from "@/context/AuthContext";
import { Footer } from "./footer/Footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/sidebar/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  title?: string; // Add title prop to support existing usage
}

const Layout: React.FC<LayoutProps> = ({ children, fullWidth = false, title }) => {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  // Update document title if title prop is provided
  React.useEffect(() => {
    if (title) {
      document.title = `${title} | Fluida`;
    } else {
      document.title = "Fluida";
    }
  }, [title]);

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
