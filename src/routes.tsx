import { lazy } from "react";

import { Main } from "@/components/layouts/Main";
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
import InstagramCallback from "@/pages/auth/InstagramCallback";

const routes = [
  {
    path: "/",
    element: (
      <Main>
        <Home />
      </Main>
    ),
    protected: true,
  },
  {
    path: "/login",
    element: (
      <GuestGuard>
        <Login />
      </GuestGuard>
    ),
  },
  {
    path: "/register",
    element: (
      <GuestGuard>
        <Register />
      </GuestGuard>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <GuestGuard>
        <ForgotPassword />
      </GuestGuard>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <GuestGuard>
        <ResetPassword />
      </GuestGuard>
    ),
  },
  {
    path: "/profile",
    element: (
      <AuthGuard>
        <Main>
          <Profile />
        </Main>
      </AuthGuard>
    ),
    protected: true,
  },
  {
    path: "/diagnostic",
    element: (
      <AuthGuard>
        <Main>
          <Diagnostic />
        </Main>
      </AuthGuard>
    ),
    protected: true,
  },
  {
    path: "/creative-agenda",
    element: (
      <AuthGuard>
        <Main>
          <CreativeAgenda />
        </Main>
      </AuthGuard>
    ),
    protected: true,
  },
  {
    path: "/integrations",
    element: (
      <AuthGuard>
        <Main>
          <Integrations />
        </Main>
      </AuthGuard>
    ),
    protected: true,
  },
  {
    path: "/billing",
    element: (
      <AuthGuard>
        <Main>
          <Billing />
        </Main>
      </AuthGuard>
    ),
    protected: true,
  },
  {
    path: "/pricing",
    element: (
      <Main>
        <Pricing />
      </Main>
    ),
  },
  {
    path: "/onboarding",
    element: (
      <AuthGuard>
        <Main>
          <Onboarding />
        </Main>
      </AuthGuard>
    ),
    protected: true,
  },
  {
    path: "*",
    element: (
      <Main>
        <NotFound />
      </Main>
    ),
  },
  {
    path: "/auth/instagram/callback",
    element: <InstagramCallback />
  },
];

export default routes;
