
import React from "react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "./Sidebar";
import Navbar from "../navbar/Navbar";

const SIDEBAR_WIDTH = 104;
const NAVBAR_HEIGHT = 64;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar />
      <div
        className="min-h-screen flex flex-col"
        style={{ marginLeft: SIDEBAR_WIDTH }}
      >
        <Navbar />
        <main 
          className="flex-1 overflow-auto px-2 md:px-6"
          style={{ paddingTop: NAVBAR_HEIGHT + 8 }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
