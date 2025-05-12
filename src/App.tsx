import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ROUTES } from "@/routes";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/hooks/use-toast";

// Pages
import HomePage from "@/pages/HomePage";
import PricingPage from "@/pages/PricingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import AccountSettings from "@/pages/AccountSettings";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import UpdatePasswordPage from "@/pages/UpdatePasswordPage";
import AdminUsersPage from "@/pages/AdminUsersPage";
import AdminEquipmentsPage from "@/pages/AdminEquipmentsPage";
import AdminVimeoSettings from "@/pages/AdminVimeoSettings";
import BatchImportPage from "@/pages/BatchImportPage";
import RoteirosPage from "@/pages/RoteirosPage";
import AdminVideosPage from './pages/admin/videos';

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <HomePage />,
  },
  {
    path: ROUTES.PRICING,
    element: <PricingPage />,
  },
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.REGISTER,
    element: <RegisterPage />,
  },
  {
    path: ROUTES.DASHBOARD,
    element: <DashboardPage />,
  },
  {
    path: ROUTES.ACCOUNT,
    element: <AccountSettings />,
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: <ForgotPasswordPage />,
  },
  {
    path: ROUTES.UPDATE_PASSWORD,
    element: <UpdatePasswordPage />,
  },
  {
    path: ROUTES.ADMIN_USERS,
    element: <AdminUsersPage />,
  },
  {
    path: ROUTES.ADMIN_EQUIPMENTS,
    element: <AdminEquipmentsPage />,
  },
  {
    path: ROUTES.ADMIN_VIMEO_SETTINGS,
    element: <AdminVimeoSettings />,
  },
  {
    path: ROUTES.ADMIN_VIDEOS_BATCH_IMPORT,
    element: <BatchImportPage />,
  },
  {
    path: ROUTES.ROTEIROS,
    element: <RoteirosPage />,
  },
  {
    path: ROUTES.ADMIN_VIDEOS,
    element: <AdminVideosPage />
  },
]);

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
