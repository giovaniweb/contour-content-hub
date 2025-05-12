
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
import AdminVideosPage from './pages/admin/videos';
import VideoBatchManage from './pages/videos/VideoBatchManage';
import NotFound from '@/pages/NotFound';

// Layout Components
import AppLayout from "@/components/layout/AppLayout";
import AdminLayout from "@/components/layout/AdminLayout";

// Create router configuration with layouts
const routes = [
  {
    path: ROUTES.HOME,
    element: <HomePage />,
  },
  {
    path: ROUTES.VIDEOS.ROOT,
    element: 
      <AppLayout>
        <VideosPage />
      </AppLayout>,
  },
  {
    path: ROUTES.CONTENT.STRATEGY,
    element: 
      <AppLayout>
        <ContentStrategy />
      </AppLayout>,
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
    path: ROUTES.VIDEOS.PLAYER + "/:id",
    element: 
      <AppLayout>
        <VideoPlayer />
      </AppLayout>,
  },
  {
    path: ROUTES.ADMIN.ROOT,
    element: 
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>,
  },
  {
    path: ROUTES.ADMIN_VIDEOS,
    element: 
      <AdminLayout>
        <AdminVideosPage />
      </AdminLayout>,
  },
  {
    path: ROUTES.ADMIN.EQUIPMENT,
    element: 
      <AdminLayout>
        <AdminEquipments />
      </AdminLayout>,
  },
  {
    path: ROUTES.VIDEOS.BATCH,
    element: 
      <AdminLayout>
        <VideoBatchManage />
      </AdminLayout>,
  },
  {
    path: ROUTES.VIDEOS.IMPORT,
    element: 
      <AdminLayout>
        <VideoBatchImport />
      </AdminLayout>,
  },
  {
    path: "*",
    element: <NotFound />,
  }
];

// Create router instance
const router = createBrowserRouter(routes);

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
