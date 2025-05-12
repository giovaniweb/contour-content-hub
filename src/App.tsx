
import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ROUTES } from "@/routes";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

// Pages
import HomePage from "@/pages/HomePage";
import AdminVideosPage from './pages/admin/videos';

// Create router configuration
const routes = [
  {
    path: ROUTES.HOME,
    element: <HomePage />,
  },
  {
    path: ROUTES.ADMIN_VIDEOS,
    element: <AdminVideosPage />
  },
  // Add other routes as they become available
];

// Create router instance
const router = createBrowserRouter(routes);

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
