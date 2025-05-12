
import React from "react";
import { RouteObject } from "react-router-dom";

// Lazy loaded pages for better performance
import HomePage from "@/pages/HomePage";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/Profile";
import ContentStrategy from "@/pages/ContentStrategy";
import ContentPlannerPage from "@/pages/ContentPlannerPage";
import EquipmentsPage from "@/pages/EquipmentsPage";
import MediaLibraryPage from "@/pages/MediaLibraryPage";
import ScriptGeneratorPage from "@/pages/ScriptGeneratorPage";
import VideoStorage from "@/pages/videos/VideoStorage";
import VideoBatchManage from "@/pages/videos/VideoBatchManage";
import EquipmentDetailsPage from "@/pages/EquipmentDetailsPage";
import ScriptValidationPage from "@/pages/ScriptValidationPage";
import TechnicalDocuments from "@/pages/TechnicalDocuments";
import DocumentDetail from "@/pages/DocumentDetail";
import ReportsPage from "@/pages/ReportsPage";
import IdeaValidatorPage from "@/pages/IdeaValidatorPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminEquipments from "@/pages/admin/AdminEquipments";
import AdminContent from "@/pages/admin/AdminContent";
import AdminAIPanel from "@/pages/admin/AdminAIPanel";
import VimeoSettings from "@/pages/admin/VimeoSettings";
import VimeoCallback from "@/pages/auth/VimeoCallback";
import VideoBatchImport from "@/pages/videos/VideoBatchImport";
import SystemDiagnostics from "@/pages/admin/SystemDiagnostics";
import SystemIntelligence from "@/pages/admin/SystemIntelligence";
import VideoSwipe from "@/pages/videos/VideoSwipe";
import VideoPlayer from "@/pages/videos/VideoPlayer";
import InvitesPage from "@/pages/InvitesPage";
import WorkspaceSettings from "@/pages/admin/WorkspaceSettings";
import ConsultantPanel from "@/pages/consultant/ConsultantPanel";
import Calendar from "@/pages/Calendar";
import VideosPage from "@/pages/videos";

// Main route paths
export const ROUTES = {
  // Public routes
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  
  // Auth callback routes
  AUTH: {
    VIMEO_CALLBACK: "/vimeo/callback"
  },
  
  // Protected routes
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  WORKSPACE_SETTINGS: "/workspace-settings",
  INVITES: "/invites",
  
  // Content
  CONTENT: {
    STRATEGY: "/content-strategy",
    PLANNER: "/content-planner",
    IDEAS: "/content-ideas",
    SCRIPTS: {
      ROOT: "/scripts",
      GENERATOR: "/script-generator",
      VALIDATION: "/script-validation"
    },
    CALENDAR: "/calendar"
  },
  
  // Videos
  VIDEOS: {
    ROOT: "/videos",
    STORAGE: "/video-storage",
    BATCH: "/video-batch",
    IMPORT: "/video-import",
    SWIPE: "/video-swipe",
    PLAYER: "/video-player"
  },
  
  // Equipment & Media
  EQUIPMENT: {
    LIST: "/equipments",
    DETAILS: (id: string = ":id") => `/equipment/${id}`
  },
  MEDIA: "/media",
  
  // Documentation
  DOCUMENTS: {
    ROOT: "/documents",
    DETAILS: (id: string = ":id") => `/document/${id}`
  },
  SCIENTIFIC_ARTICLES: "/scientific-articles",
  
  // Marketing
  MARKETING: {
    CONSULTANT: "/marketing-consultant",
    REPORTS: "/reports"
  },
  
  // Consultant
  CONSULTANT: {
    PANEL: "/consultant"
  },
  
  // Admin routes
  ADMIN: {
    ROOT: "/admin",
    EQUIPMENT: "/admin/equipments",
    CONTENT: "/admin/content",
    AI: "/admin/ai",
    SYSTEM: {
      DIAGNOSTICS: "/admin/system-diagnostics",
      INTELLIGENCE: "/admin/system-intelligence"
    },
    VIMEO: {
      SETTINGS: "/admin/vimeo-settings"
    },
    WORKSPACE: "/admin/workspace"
  },
  
  // Error
  NOT_FOUND: "*"
};

// Route configuration for React Router
export const routeConfig: RouteObject[] = [
  // Public routes
  {
    path: ROUTES.HOME,
    element: <HomePage />
  },
  {
    path: ROUTES.LOGIN,
    element: <Login />
  },
  {
    path: ROUTES.REGISTER,
    element: <Register />
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: <ForgotPassword />
  },
  {
    path: ROUTES.RESET_PASSWORD,
    element: <ResetPassword />
  },
  {
    path: ROUTES.AUTH.VIMEO_CALLBACK,
    element: <VimeoCallback />
  },
  
  // Protected routes (will be wrapped with PrivateRoute in App.tsx)
  {
    path: ROUTES.DASHBOARD,
    element: <Dashboard />
  },
  {
    path: ROUTES.PROFILE,
    element: <Profile />
  },
  {
    path: ROUTES.CONTENT.STRATEGY,
    element: <ContentStrategy />
  },
  {
    path: ROUTES.CONTENT.PLANNER,
    element: <ContentPlannerPage />
  },
  {
    path: ROUTES.EQUIPMENT.LIST,
    element: <EquipmentsPage />
  },
  {
    path: ROUTES.CONTENT.CALENDAR,
    element: <Calendar />
  },
  {
    path: ROUTES.MEDIA,
    element: <MediaLibraryPage />
  },
  {
    path: ROUTES.CONTENT.SCRIPTS.GENERATOR,
    element: <ScriptGeneratorPage />
  },
  {
    path: ROUTES.VIDEOS.STORAGE,
    element: <VideoStorage />
  },
  {
    path: ROUTES.VIDEOS.ROOT,
    element: <VideosPage />
  },
  {
    path: ROUTES.VIDEOS.BATCH,
    element: <VideoBatchManage />
  },
  {
    path: ROUTES.EQUIPMENT.DETAILS(),
    element: <EquipmentDetailsPage />
  },
  {
    path: ROUTES.CONTENT.SCRIPTS.VALIDATION,
    element: <ScriptValidationPage />
  },
  {
    path: ROUTES.DOCUMENTS.ROOT,
    element: <TechnicalDocuments />
  },
  {
    path: ROUTES.DOCUMENTS.DETAILS(),
    element: <DocumentDetail />
  },
  {
    path: ROUTES.MARKETING.REPORTS,
    element: <ReportsPage />
  },
  {
    path: ROUTES.CONTENT.IDEAS,
    element: <IdeaValidatorPage />
  },
  {
    path: ROUTES.ADMIN.VIMEO.SETTINGS,
    element: <VimeoSettings />
  },
  {
    path: ROUTES.VIDEOS.IMPORT,
    element: <VideoBatchImport />
  },
  {
    path: ROUTES.VIDEOS.SWIPE,
    element: <VideoSwipe />
  },
  {
    path: ROUTES.MARKETING.CONSULTANT,
    element: <VideoSwipe />
  },
  {
    path: ROUTES.SCIENTIFIC_ARTICLES,
    element: <VideoSwipe />
  },
  {
    path: ROUTES.VIDEOS.PLAYER,
    element: <VideoPlayer />
  },
  {
    path: ROUTES.INVITES,
    element: <InvitesPage />
  },
  {
    path: ROUTES.WORKSPACE_SETTINGS,
    element: <WorkspaceSettings />
  },
  // Consultant routes will be wrapped with PrivateRoute in App.tsx
  {
    path: ROUTES.CONSULTANT.PANEL,
    element: <ConsultantPanel />
  },
  // Admin routes will be wrapped with AdminRoute in App.tsx
  {
    path: ROUTES.ADMIN.ROOT,
    element: <AdminDashboard />
  },
  {
    path: ROUTES.ADMIN.EQUIPMENT,
    element: <AdminEquipments />
  },
  {
    path: ROUTES.ADMIN.CONTENT,
    element: <AdminContent />
  },
  {
    path: ROUTES.ADMIN.AI,
    element: <AdminAIPanel />
  },
  {
    path: ROUTES.ADMIN.SYSTEM.DIAGNOSTICS,
    element: <SystemDiagnostics />
  },
  {
    path: ROUTES.ADMIN.SYSTEM.INTELLIGENCE,
    element: <SystemIntelligence />
  },
  // 404 Route
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFound />
  }
];

export default routeConfig;
