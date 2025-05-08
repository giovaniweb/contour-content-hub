
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
import { AuthProvider } from '@/context/AuthContext';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
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
      path: "/admin/dashboard",
      element: <Navigate to="/admin/system-diagnostics" replace />,
    },
    {
      path: "/dashboard",
      element: <Navigate to="/" replace />,
    },
    {
      path: "/equipments",
      element: <Navigate to="/" replace />,
    },
    {
      path: "*",
      element: <NotFound />,
    }
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
