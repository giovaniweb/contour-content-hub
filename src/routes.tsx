
import { lazy } from "react";

import AppLayout from "@/components/layouts/AppLayout";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { GuestGuard } from "@/components/auth/GuestGuard";

const Home = lazy(() => import("@/pages/Home"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Profile = lazy(() => import("@/pages/Profile"));
const Diagnostic = lazy(() => import("@/pages/Diagnostic"));
const CreativeAgenda = lazy(() => import("@/pages/CreativeAgenda"));
const Integrations = lazy(() => import("@/pages/Integrations"));
const Billing = lazy(() => import("@/pages/Billing"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const AdminSystemDiagnostics = lazy(() => import("@/pages/AdminSystemDiagnostics"));

// Lazy load das novas páginas de artigos científicos
const AdminScientificArticles = lazy(() => import("@/pages/admin/AdminScientificArticles"));
const AdminScientificArticleForm = lazy(() => import("@/pages/admin/AdminScientificArticleForm"));

const routes = [
  {
    path: "/",
    element: (
      <AppLayout>
        <AuthGuard>
          <Home />
        </AuthGuard>
      </AppLayout>
    ),
  },
  {
    path: "/login",
    element: (
      <AppLayout>
        <GuestGuard>
          <Login />
        </GuestGuard>
      </AppLayout>
    ),
  },
  {
    path: "/register",
    element: (
      <AppLayout>
        <GuestGuard>
          <Register />
        </GuestGuard>
      </AppLayout>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <AppLayout>
        <GuestGuard>
          <ForgotPassword />
        </GuestGuard>
      </AppLayout>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <AppLayout>
        <GuestGuard>
          <ResetPassword />
        </GuestGuard>
      </AppLayout>
    ),
  },
  {
    path: "/profile",
    element: (
      <AppLayout>
        <AuthGuard>
          <Profile />
        </AuthGuard>
      </AppLayout>
    ),
  },
  {
    path: "/diagnostic",
    element: (
      <AppLayout>
        <AuthGuard>
          <Diagnostic />
        </AuthGuard>
      </AppLayout>
    ),
  },
  {
    path: "/creative-agenda",
    element: (
      <AppLayout>
        <AuthGuard>
          <CreativeAgenda />
        </AuthGuard>
      </AppLayout>
    ),
  },
  {
    path: "/integrations",
    element: (
      <AppLayout>
        <AuthGuard>
          <Integrations />
        </AuthGuard>
      </AppLayout>
    ),
  },
  {
    path: "/billing",
    element: (
      <AppLayout>
        <AuthGuard>
          <Billing />
        </AuthGuard>
      </AppLayout>
    ),
  },
  {
    path: "/pricing",
    element: (
      <AppLayout>
        <Pricing />
      </AppLayout>
    ),
  },
  {
    path: "/onboarding",
    element: (
      <AppLayout>
        <AuthGuard>
          <Onboarding />
        </AuthGuard>
      </AppLayout>
    ),
  },
  {
    path: "/admin/system-diagnostics",
    element: (
      <AppLayout>
        <AuthGuard>
          <AdminSystemDiagnostics />
        </AuthGuard>
      </AppLayout>
    ),
  },
  {
    path: "/admin/scientific-articles",
    element: (
      <AppLayout>
        <AuthGuard>
          <AdminScientificArticles />
        </AuthGuard>
      </AppLayout>
    ),
  },
  {
    path: "/admin/scientific-articles/new",
    element: (
      <AppLayout>
        <AuthGuard>
          <AdminScientificArticleForm />
        </AuthGuard>
      </AppLayout>
    ),
  },
  {
    path: "*",
    element: (
      <AppLayout>
        <NotFound />
      </AppLayout>
    ),
  },
];

export default routes;
