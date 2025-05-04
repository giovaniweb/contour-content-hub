
import { Routes, Route } from "react-router-dom";
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
import PrivateRoute from "@/components/PrivateRoute";

function App() {
  return (
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
  );
}

export default App;
