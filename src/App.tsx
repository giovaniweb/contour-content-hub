import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  RouteObject
} from "react-router-dom";
import { ROUTES } from "@/routes";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import PrivateRoute from "@/components/PrivateRoute";

// Public Pages
import HomePage from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

// Main Content Pages
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import WorkspaceSettings from '@/pages/WorkspaceSettings';

// Scripts & Content Strategy
import ContentScripts from '@/pages/ContentScripts';
import ScriptGenerator from '@/pages/ScriptGenerator';
import ScriptValidation from '@/pages/ScriptValidation';
import ContentPlanner from '@/pages/ContentPlannerPage';
import ContentStrategy from '@/pages/ContentStrategy';
import ContentIdeas from '@/pages/IdeaValidatorPage';
import Calendar from '@/pages/Calendar';

// Videos
import VideosPage from "@/pages/VideosPage";
import VideoPlayer from "@/pages/VideoPlayer";
import VideoCreatePage from './pages/videos/VideoCreatePage';
import VideoImportPage from './pages/videos/VideoImportPage';
import VideoStorage from './pages/videos/VideoStorage';
import VideoBatchManage from './pages/videos/VideoBatchManage';
import VideoSwipe from './pages/videos/VideoSwipe';

// Knowledge Base
import Media from '@/pages/Media';
import DocumentsPage from '@/pages/TechnicalDocuments';
import ScientificArticles from '@/pages/ScientificArticles';
import EquipmentList from '@/pages/EquipmentList';
import MarketingConsultant from '@/pages/MarketingConsultant';

// Admin
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminContent from "@/pages/admin/AdminContent";
import AdminVideosPage from './pages/admin/videos';
import AdminEquipments from "@/pages/admin/AdminEquipments";
import AdminAIPanel from '@/pages/admin/AdminAIPanel';
import AdminVimeoSettings from '@/pages/admin/VimeoSettings';
import AdminSystemDiagnostics from '@/pages/admin/SystemDiagnostics';
import AdminSystemIntelligence from '@/pages/admin/SystemIntelligence';
import AdminWorkspace from '@/pages/admin/WorkspaceSettings';

// Other
import ReportsPage from '@/pages/reports/ReportsPage';
import NotFound from '@/pages/NotFound';

console.log('App initialization');

// Define routes with better organization
const routes: RouteObject[] = [
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
  {
    path: ROUTES.RESET_PASSWORD,
    element: <ResetPassword />,
  },
  
  // Protected routes wrapper
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: <Dashboard />,
      },
      {
        path: ROUTES.PROFILE,
        element: <Profile />,
      },
      {
        path: ROUTES.WORKSPACE_SETTINGS,
        element: <WorkspaceSettings />,
      },
      
      // Scripts & Content Strategy
      {
        path: ROUTES.CONTENT.SCRIPTS.ROOT,
        element: <ContentScripts />,
      },
      {
        path: ROUTES.CONTENT.SCRIPTS.GENERATOR,
        element: <ScriptGenerator />,
      },
      {
        path: ROUTES.CONTENT.SCRIPTS.VALIDATION,
        element: <ScriptValidation />,
      },
      {
        path: ROUTES.CONTENT.PLANNER,
        element: <ContentPlanner />,
      },
      {
        path: ROUTES.CONTENT.STRATEGY,
        element: <ContentStrategy />,
      },
      {
        path: ROUTES.CONTENT.IDEAS,
        element: <ContentIdeas />,
      },
      {
        path: ROUTES.CONTENT.CALENDAR,
        element: <Calendar />,
      },
      
      // Videos
      {
        path: ROUTES.VIDEOS.ROOT,
        element: <VideosPage />,
      },
      {
        path: `${ROUTES.VIDEOS.PLAYER}/:id`,
        element: <VideoPlayer />,
      },
      {
        path: ROUTES.VIDEOS.CREATE,
        element: <VideoCreatePage />,
      },
      {
        path: ROUTES.VIDEOS.IMPORT,
        element: <VideoImportPage />,
      },
      {
        path: ROUTES.VIDEOS.STORAGE,
        element: <VideoStorage />,
      },
      {
        path: ROUTES.VIDEOS.BATCH,
        element: <VideoBatchManage />,
      },
      {
        path: ROUTES.VIDEOS.SWIPE,
        element: <VideoSwipe />,
      },
      
      // Knowledge Base
      {
        path: ROUTES.MEDIA,
        element: <Media />,
      },
      {
        path: ROUTES.DOCUMENTS.ROOT,
        element: <DocumentsPage />,
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
        path: ROUTES.MARKETING.CONSULTANT,
        element: <MarketingConsultant />,
      },
      
      // Admin routes
      {
        path: ROUTES.ADMIN.ROOT,
        element: <AdminDashboard />,
      },
      {
        path: ROUTES.ADMIN.CONTENT,
        element: <AdminContent />,
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
        path: ROUTES.ADMIN.AI,
        element: <AdminAIPanel />,
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
        path: ROUTES.ADMIN.WORKSPACE,
        element: <AdminWorkspace />,
      },
      
      // Reports
      {
        path: ROUTES.MARKETING.REPORTS,
        element: <ReportsPage />,
      },
    ]
  },
  
  // Catch all route
  {
    path: "*",
    element: <NotFound />,
  },
];

const router = createBrowserRouter(routes);

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <SidebarProvider>
          <RouterProvider router={router} />
          <Toaster />
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
