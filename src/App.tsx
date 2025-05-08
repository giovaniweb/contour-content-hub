import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminPanel from './pages/AdminPanel';
import MediaManagement from './pages/MediaManagement';
import UserManagement from './pages/UserManagement';
import ScientificArticle from './pages/ScientificArticle';
import ScriptList from './pages/ScriptList';
import ScriptView from './pages/ScriptView';
import ScriptGenerator from './pages/ScriptGenerator';
import ContentStrategy from './pages/ContentStrategy';
import ContentPlannerPage from "./pages/ContentPlannerPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />

        {/* Private Routes */}
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/admin-panel" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
        <Route path="/media-management" element={<PrivateRoute><MediaManagement /></PrivateRoute>} />
        <Route path="/user-management" element={<PrivateRoute><UserManagement /></PrivateRoute>} />
        <Route path="/scientific-article" element={<PrivateRoute><ScientificArticle /></PrivateRoute>} />
        <Route path="/script-list" element={<PrivateRoute><ScriptList /></PrivateRoute>} />
        <Route path="/script-view/:id" element={<PrivateRoute><ScriptView /></PrivateRoute>} />
        <Route path="/script-generator" element={<PrivateRoute><ScriptGenerator /></PrivateRoute>} />
        <Route path="/content-strategy" element={<PrivateRoute><ContentStrategy /></PrivateRoute>} />
        {/* Content Planner */}
        <Route path="/content-planner" element={<PrivateRoute><ContentPlannerPage /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
