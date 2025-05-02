import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import ScriptHistory from "@/pages/ScriptHistory";
import ScriptValidation from "@/pages/ScriptValidation";
import ScriptValidationPage from "@/pages/ScriptValidationPage";
import Calendar from "@/pages/Calendar";
import CustomGpt from "@/pages/CustomGpt";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";
import MediaLibrary from "@/pages/MediaLibrary";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminEquipments from "@/pages/AdminEquipments";
import AdminContent from "@/pages/AdminContent";
import AdminIntegrations from "@/pages/AdminIntegrations";
import SellerDashboard from "@/pages/SellerDashboard";
import ClientList from "@/pages/ClientList";
import ClientDetail from "@/pages/ClientDetail";
import NotFound from "@/pages/NotFound";
import EquipmentDetailsPage from "@/pages/EquipmentDetailsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/script-history",
    element: <ScriptHistory />,
  },
  {
    path: "/script-validation",
    element: <ScriptValidation />,
  },
  {
    path: "/script-validation-page",
    element: <ScriptValidationPage />,
  },
  {
    path: "/calendar",
    element: <Calendar />,
  },
  {
    path: "/custom-gpt",
    element: <CustomGpt />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/media-library",
    element: <MediaLibrary />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/equipments",
    element: <AdminEquipments />,
  },
  {
    path: "/admin/equipment/:id",
    element: <EquipmentDetailsPage />,
  },
  {
    path: "/admin/content",
    element: <AdminContent />,
  },
  {
    path: "/admin/integrations",
    element: <AdminIntegrations />,
  },
  {
    path: "/seller/dashboard",
    element: <SellerDashboard />,
  },
  {
    path: "/seller/clients",
    element: <ClientList />,
  },
  {
    path: "/seller/client/:id",
    element: <ClientDetail />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
