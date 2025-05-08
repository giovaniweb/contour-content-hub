import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import HomePage from "@/pages/HomePage";
import UploadPage from "@/pages/UploadPage";
import VideoStorage from "@/pages/VideoStorage";
import VideoSwipe from "@/pages/VideoSwipe";
import VideoPlayer from "@/pages/VideoPlayer";
import BatchVideoManager from '@/pages/BatchVideoManager';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import EquipmentPage from '@/pages/EquipmentPage';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/upload",
      element: (
        <ProtectedRoute>
          <UploadPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/video-storage",
      element: (
        <ProtectedRoute>
          <VideoStorage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/batch-video-manager",
      element: (
        <ProtectedRoute>
          <BatchVideoManager />
        </ProtectedRoute>
      ),
    },
    {
      path: "/equipments",
      element: (
        <ProtectedRoute>
          <EquipmentPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/video-swipe",
      element: <VideoSwipe />,
    },
    {
      path: "/video-player",
      element: <VideoPlayer />,
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
