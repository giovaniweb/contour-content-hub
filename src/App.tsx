
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Profile from "@/pages/Profile";
import ScriptHistory from "@/pages/ScriptHistory";
import MediaLibrary from "@/pages/MediaLibrary";
import MarketingConsultant from "@/pages/MarketingConsultant";
import CalendarPage from "@/pages/Calendar";
import { AuthProvider } from "@/context/AuthContext";

// Let's create a PrivateRoute component
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const PrivateRoute = ({ element }: { element: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{element}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="light" attribute="class">
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
            <Route path="/scripts" element={<PrivateRoute element={<ScriptHistory />} />} />
            <Route path="/media-library" element={<PrivateRoute element={<MediaLibrary />} />} />
            <Route path="/marketing-consultant" element={<PrivateRoute element={<MarketingConsultant />} />} />
            <Route path="/calendar" element={<PrivateRoute element={<CalendarPage />} />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
