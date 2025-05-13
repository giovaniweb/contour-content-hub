
import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Link
} from "react-router-dom";
import { ROUTES } from "@/routes";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button"; // Add Button import

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
import VideoImportPage from './pages/videos/VideoImportPage';
import VideoSwipe from './pages/videos/VideoSwipe';
import VideoStorage from './pages/VideoStorage';
import VideoCreatePage from './pages/videos/VideoCreatePage';
import ContentScripts from '@/pages/ContentScripts';
import ScientificArticles from '@/pages/ScientificArticles';
import EquipmentList from '@/pages/EquipmentList';
import AdminVimeoSettings from '@/pages/admin/VimeoSettings';
import AdminSystemDiagnostics from '@/pages/admin/SystemDiagnostics';
import AdminSystemIntelligence from '@/pages/admin/SystemIntelligence';
import AdminContent from '@/pages/admin/AdminContent';
import AdminWorkspace from '@/pages/admin/WorkspaceSettings';
import ReportsPage from '@/pages/reports/ReportsPage';
import Dashboard from '@/pages/Dashboard';

console.log('App initialization');

// Create router configuration with error boundaries and proper layouts
const router = createBrowserRouter([
  // Public routes
  {
    path: ROUTES.HOME,
    element: <HomePage />,
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
  
  // Protected routes
  {
    path: ROUTES.DASHBOARD,
    element: <Dashboard />,
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
    path: ROUTES.VIDEOS.PLAYER + "/:id",
    element: <VideoPlayer />,
  },
  {
    path: ROUTES.VIDEOS.BATCH,
    element: <VideoBatchManage />,
  },
  {
    path: ROUTES.VIDEOS.IMPORT,
    element: <VideoImportPage />,
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
    path: ROUTES.VIDEOS.CREATE,
    element: <VideoCreatePage />,
  },
  {
    path: ROUTES.CONTENT.SCRIPTS.ROOT,
    element: <ContentScripts />,
  },
  {
    path: ROUTES.SCIENTIFIC_ARTICLES,
    element: <ScientificArticles />,
  },
  {
    path: ROUTES.EQUIPMENT.LIST,
    element: <EquipmentList />,
  },
  {
    path: ROUTES.MARKETING.REPORTS,
    element: <ReportsPage />,
  },
  
  // Admin routes
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
    path: ROUTES.ADMIN.VIMEO.SETTINGS,
    element: <AdminVimeoSettings />,
  },
  {
    path: ROUTES.ADMIN.SYSTEM.DIAGNOSTICS,
    element: <AdminSystemDiagnostics />,
  },
  {
    path: ROUTES.ADMIN.SYSTEM.INTELLIGENCE,
    element: <AdminSystemIntelligence />,
  },
  {
    path: ROUTES.ADMIN.CONTENT,
    element: <AdminContent />,
  },
  {
    path: ROUTES.ADMIN.WORKSPACE,
    element: <AdminWorkspace />,
  },
  
  // Catch all route - 404
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

// NotFound component
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-zinc-50 p-4 text-center">
      <div className="max-w-md">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-2xl font-medium text-gray-800 mb-6">Página não encontrada</p>
        <p className="text-gray-600 mb-8">
          A página que você está procurando pode ter sido removida, renomeada ou está temporariamente indisponível.
        </p>
        <Button asChild className="bg-gradient-to-r from-[#0094fb] to-[#f300fc] hover:opacity-90 text-white">
          <Link to={ROUTES.HOME}>Voltar para a página inicial</Link>
        </Button>
      </div>
    </div>
  );
}
