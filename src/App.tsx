
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
      path: "/technical-documents",
      element: <Navigate to="/media" replace />,
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
