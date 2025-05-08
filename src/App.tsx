
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import HomePage from "@/pages/HomePage";
import VideoStorage from "@/pages/VideoStorage";
import VideoSwipe from "@/pages/VideoSwipe";
import VideoPlayer from "@/pages/VideoPlayer";
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
