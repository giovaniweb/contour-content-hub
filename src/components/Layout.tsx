
import React from "react";
import Navbar from "./Navbar";
import { useAuth } from "@/context/AuthContext";
import { Footer } from "./footer/Footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/sidebar/Sidebar";
import MobileBottomNav from "@/components/mobile/MobileBottomNav";
import { AnimatePresence, motion } from "framer-motion";
import { slideVariants } from "@/lib/animations";
import CollapsibleHeader from "./header/CollapsibleHeader";

interface LayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  title?: string;
  showBack?: boolean;
  hideNav?: boolean;
  transparentHeader?: boolean;
  headerActions?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  fullWidth = false, 
  title,
  showBack = false,
  hideNav = false,
  transparentHeader = false,
  headerActions
}) => {
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
    <div className="flex min-h-screen flex-col overflow-hidden bg-background">
      {isAuthenticated ? (
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <Sidebar />
            <div className="flex flex-1 flex-col">
              {!hideNav && (
                <CollapsibleHeader 
                  title={title} 
                  showBack={showBack}
                  transparent={transparentHeader}
                  actions={headerActions}
                />
              )}
              
              <AnimatePresence mode="wait">
                <motion.main 
                  key={title || "main"}
                  className={`flex-1 ${!fullWidth && "container"} pb-16 md:pb-0`}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={slideVariants}
                  transition={{ duration: 0.3 }}
                >
                  {children}
                </motion.main>
              </AnimatePresence>
              
              <Footer />
              <MobileBottomNav />
            </div>
          </div>
        </SidebarProvider>
      ) : (
        <>
          <Navbar />
          <AnimatePresence mode="wait">
            <motion.main 
              key={title || "main"}
              className={`flex-1 ${!fullWidth && "container"}`}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={slideVariants}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.main>
          </AnimatePresence>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Layout;
