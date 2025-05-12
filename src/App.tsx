
import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ROUTES } from "@/routes";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";

// Pages
import HomePage from "@/pages/HomePage";
import VideosPage from "@/pages/VideosPage";
import ContentStrategy from "@/pages/ContentStrategy";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import VideoPlayer from "@/pages/VideoPlayer";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminVideosPage from './pages/admin/videos';
import AdminEquipments from "@/pages/admin/AdminEquipments";
import VideoBatchManage from './pages/videos/VideoBatchManage';
import VideoBatchImport from './pages/videos/VideoBatchImport';
import VideoSwipe from './pages/videos/VideoSwipe';
import VideoStorage from './pages/videos/VideoStorage';
import NotFound from '@/pages/NotFound';

// Create router configuration
const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <HomePage />,
  },
  {
    path: ROUTES.VIDEOS.ROOT,
    element: <VideosPage />,
  },
  {
    path: ROUTES.CONTENT.STRATEGY,
    element: <ContentStrategy />,
  },
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTES.REGISTER,
    element: <Register />,
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: <ForgotPassword />,
  },
  {
    path: ROUTES.VIDEOS.PLAYER + "/:id",
    element: <VideoPlayer />,
  },
  {
    path: ROUTES.ADMIN.ROOT,
    element: <AdminDashboard />,
  },
  {
    path: ROUTES.ADMIN_VIDEOS,
    element: <AdminVideosPage />,
  },
  {
    path: ROUTES.ADMIN.EQUIPMENT,
    element: <AdminEquipments />,
  },
  {
    path: ROUTES.VIDEOS.BATCH,
    element: <VideoBatchManage />,
  },
  {
    path: ROUTES.VIDEOS.IMPORT,
    element: <VideoBatchImport />,
  },
  {
    path: ROUTES.VIDEOS.SWIPE,
    element: <VideoSwipe />,
  },
  {
    path: ROUTES.VIDEOS.STORAGE,
    element: <VideoStorage />,
  },
  {
    path: ROUTES.CONTENT.SCRIPTS.ROOT,
    element: <ContentStrategy />, // Temporariamente redirecionando para ContentStrategy até termos a página de scripts
  },
  {
    path: "*",
    element: <NotFound />,
  }
]);

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <SidebarProvider>
          <Toaster position="top-right" />
          <RouterProvider router={router} />
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
