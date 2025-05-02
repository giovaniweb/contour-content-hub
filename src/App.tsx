
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

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
import SellerDashboard from "@/pages/seller/SellerDashboard";
import ClientList from "@/pages/seller/ClientList";
import ClientDetail from "@/pages/seller/ClientDetail";
import NotFound from "@/pages/NotFound";
import EquipmentDetailsPage from "@/pages/EquipmentDetailsPage";
import EquipmentDetails from "@/pages/EquipmentDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/script-history" element={<ScriptHistory />} />
      <Route path="/script-validation" element={<ScriptValidation />} />
      <Route path="/script-validation-page" element={<ScriptValidationPage />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/custom-gpt" element={<CustomGpt />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/media-library" element={<MediaLibrary />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/equipments" element={<AdminEquipments />} />
      <Route path="/admin/equipment/:id" element={<EquipmentDetailsPage />} />
      <Route path="/admin/content" element={<AdminContent />} />
      <Route path="/admin/integrations" element={<AdminIntegrations />} />
      <Route path="/seller/dashboard" element={<SellerDashboard />} />
      <Route path="/seller/clients" element={<ClientList />} />
      <Route path="/seller/client/:id" element={<ClientDetail />} />
      
      {/* Add redirect for equipment-details to either admin equipments or equipment details */}
      <Route path="/equipment-details" element={<Navigate to="/admin/equipments" replace />} />
      
      {/* General equipment details page */}
      <Route path="/equipment-details/:id" element={<EquipmentDetails />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
