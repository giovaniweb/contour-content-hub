
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import HomePage from "@/pages/HomePage";
import VideoStorage from "@/pages/VideoStorage";
import VideoSwipe from "@/pages/VideoSwipe";
import VideoPlayer from "@/pages/VideoPlayer";
import Media from "@/pages/Media";
import NotFound from "@/pages/NotFound";
import VideoBatchManage from "@/pages/VideoBatchManage";
import TechnicalDocuments from "@/pages/TechnicalDocuments";
import SystemDiagnostics from "@/pages/SystemDiagnostics";
import AdminEquipments from "@/pages/AdminEquipments";
import AdminVimeoSettings from "@/pages/AdminVimeoSettings";
import AdminContent from "@/pages/AdminContent";
import EquipmentDetails from "@/pages/EquipmentDetails";
import Dashboard from "@/pages/Dashboard";
import ContentStrategy from "@/pages/ContentStrategy";
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from "@/components/ui/sonner";
import ScriptHistory from "@/pages/ScriptHistory";
import ScriptGenerator from "@/pages/ScriptGenerator";
import ScriptValidation from "@/pages/ScriptValidation";
import Calendar from "@/pages/Calendar";
import EquipmentsPage from "@/pages/EquipmentsPage";
import AdminIntegrations from "@/pages/AdminIntegrations";
import SystemIntelligence from "@/pages/SystemIntelligence";
import CustomGpt from "@/pages/CustomGpt";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
      errorElement: <NotFound />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
      errorElement: <NotFound />,
    },
    {
      path: "/video-storage",
      element: <VideoStorage />,
      errorElement: <NotFound />,
    },
    {
      path: "/videos",
      element: <Navigate to="/video-storage" replace />,
    },
    {
      path: "/videos/batch-manage",
      element: <VideoBatchManage />,
      errorElement: <NotFound />,
    },
    {
      path: "/video-swipe",
      element: <VideoSwipe />,
      errorElement: <NotFound />,
    },
    {
      path: "/video-player",
      element: <VideoPlayer />,
      errorElement: <NotFound />,
    },
    {
      path: "/media",
      element: <Media />,
      errorElement: <NotFound />,
    },
    {
      path: "/media-library",
      element: <Navigate to="/media" replace />,
    },
    {
      path: "/technical-documents",
      element: <TechnicalDocuments />,
      errorElement: <NotFound />,
    },
    {
      path: "/documents",
      element: <Navigate to="/technical-documents" replace />,
      errorElement: <NotFound />,
    },
    {
      path: "/login",
      element: <Navigate to="/" replace />,
    },
    {
      path: "/register",
      element: <Navigate to="/" replace />,
    },
    {
      path: "/script-history",
      element: <ScriptHistory />,
      errorElement: <NotFound />,
    },
    {
      path: "/generate-script",
      element: <ScriptGenerator />,
      errorElement: <NotFound />,
    },
    {
      path: "/script-validation",
      element: <ScriptValidation />,
      errorElement: <NotFound />,
    },
    {
      path: "/calendar",
      element: <Calendar />,
      errorElement: <NotFound />,
    },
    {
      path: "/equipments",
      element: <EquipmentsPage />,
      errorElement: <NotFound />,
    },
    {
      path: "/custom-gpt",
      element: <CustomGpt />,
      errorElement: <NotFound />,
    },
    {
      path: "/admin",
      errorElement: <NotFound />,
      children: [
        {
          path: "dashboard",
          element: <Navigate to="/admin/system-diagnostics" replace />,
        },
        {
          path: "system-diagnostics",
          element: <SystemDiagnostics />,
        },
        {
          path: "equipments",
          element: <AdminEquipments />,
        },
        {
          path: "vimeo-settings",
          element: <AdminVimeoSettings />,
        },
        {
          path: "content",
          element: <AdminContent />,
        },
        {
          path: "integrations",
          element: <AdminIntegrations />,
        },
        {
          path: "system-intelligence",
          element: <SystemIntelligence />,
        },
      ]
    },
    {
      path: "/equipments/:id",
      element: <EquipmentDetails />,
      errorElement: <NotFound />,
    },
    {
      path: "/content-strategy",
      element: <ContentStrategy />,
      errorElement: <NotFound />,
    },
    {
      path: "*",
      element: <NotFound />,
    }
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
