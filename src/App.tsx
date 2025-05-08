
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
    },
    {
      path: "/video-storage",
      element: <VideoStorage />,
    },
    {
      path: "/videos",
      element: <Navigate to="/video-storage" replace />,
    },
    {
      path: "/videos/batch-manage",
      element: <VideoBatchManage />,
    },
    {
      path: "/video-swipe",
      element: <VideoSwipe />,
    },
    {
      path: "/video-player",
      element: <VideoPlayer />,
    },
    {
      path: "/media",
      element: <Media />,
    },
    {
      path: "/media-library",
      element: <Navigate to="/media" replace />,
    },
    {
      path: "/technical-documents",
      element: <TechnicalDocuments />,
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
      ]
    },
    {
      path: "/equipments/:id",
      element: <EquipmentDetails />,
    },
    {
      path: "/content-strategy",
      element: <ContentStrategy />,
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
