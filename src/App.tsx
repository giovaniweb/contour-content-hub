
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ContentPlannerPage from "./pages/ContentPlannerPage";
import EquipmentsPage from "./pages/EquipmentsPage";
import EquipmentDetails from "./pages/EquipmentDetails";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import MediaLibrary from "./pages/MediaLibrary";
import { ErrorBoundary } from './components/ErrorBoundary';
import ScriptValidation from './pages/ScriptValidation';
import CustomGpt from './pages/CustomGpt';
import VideosPage from './pages/VideosPage';
import TechnicalDocuments from './pages/TechnicalDocuments';
import ContentStrategy from './pages/ContentStrategy';
import Calendar from './pages/Calendar';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Private Routes */}
          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/content-planner" element={
            <PrivateRoute>
              <ContentPlannerPage />
            </PrivateRoute>
          } />
          <Route path="/equipments" element={
            <PrivateRoute>
              <EquipmentsPage />
            </PrivateRoute>
          } />
          <Route path="/equipments/:id" element={
            <PrivateRoute>
              <EquipmentDetails />
            </PrivateRoute>
          } />
          <Route path="/media" element={
            <PrivateRoute>
              <MediaLibrary />
            </PrivateRoute>
          } />
          {/* New routes to fix 404 errors */}
          <Route path="/custom-gpt" element={
            <PrivateRoute>
              <CustomGpt />
            </PrivateRoute>
          } />
          <Route path="/script-validation" element={
            <PrivateRoute>
              <ScriptValidation />
            </PrivateRoute>
          } />
          <Route path="/videos" element={
            <PrivateRoute>
              <VideosPage />
            </PrivateRoute>
          } />
          <Route path="/technical-documents" element={
            <PrivateRoute>
              <TechnicalDocuments />
            </PrivateRoute>
          } />
          <Route path="/content-strategy" element={
            <PrivateRoute>
              <ContentStrategy />
            </PrivateRoute>
          } />
          <Route path="/calendar" element={
            <PrivateRoute>
              <Calendar />
            </PrivateRoute>
          } />
          
          {/* Not Found Route - must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
