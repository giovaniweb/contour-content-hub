
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import './styles/aurora-design-system.css';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminEquipments from './pages/AdminEquipments';
import EquipmentDetail from './pages/EquipmentDetails';
import NotFound from './pages/NotFound';
import CreateEquipment from '@/pages/admin/CreateEquipment';
import EditEquipment from '@/pages/admin/EditEquipment';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import MarketingConsultant from './pages/MarketingConsultant';
import Media from './pages/Media';
import PhotosPage from './pages/PhotosPage';
import EquipmentList from './pages/EquipmentList';
import IdeaValidatorPage from './pages/IdeaValidatorPage';
import { ROUTES } from './routes';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Protected Routes */}
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.PROFILE} element={<Profile />} />
        
        {/* Content Routes */}
        <Route path={ROUTES.CONTENT.SCRIPTS.ROOT} element={<div>Scripts Page</div>} />
        <Route path={ROUTES.CONTENT.SCRIPTS.GENERATOR} element={<div>Script Generator</div>} />
        <Route path={ROUTES.CONTENT.SCRIPTS.VALIDATION} element={<div>Script Validation</div>} />
        <Route path={ROUTES.CONTENT.PLANNER} element={<div>Content Planner</div>} />
        <Route path={ROUTES.CONTENT.IDEAS} element={<IdeaValidatorPage />} />
        <Route path={ROUTES.CONTENT.STRATEGY} element={<div>Content Strategy</div>} />
        <Route path={ROUTES.CONTENT.CALENDAR} element={<div>Calendar</div>} />
        
        {/* Videos Routes */}
        <Route path={ROUTES.VIDEOS.ROOT} element={<div>Videos</div>} />
        <Route path={ROUTES.VIDEOS.CREATE} element={<div>Create Video</div>} />
        <Route path={ROUTES.VIDEOS.PLAYER} element={<div>Video Player</div>} />
        <Route path={ROUTES.VIDEOS.STORAGE} element={<div>Video Storage</div>} />
        <Route path={ROUTES.VIDEOS.BATCH} element={<div>Batch Videos</div>} />
        <Route path={ROUTES.VIDEOS.IMPORT} element={<div>Import Videos</div>} />
        <Route path={ROUTES.VIDEOS.SWIPE} element={<div>Video Swipe</div>} />
        
        {/* Equipment Routes */}
        <Route path={ROUTES.EQUIPMENTS.LIST} element={<EquipmentList />} />
        <Route path={ROUTES.EQUIPMENTS.DETAILS(':id')} element={<EquipmentDetail />} />
        
        {/* Media Routes */}
        <Route path={ROUTES.MEDIA} element={<Media />} />
        <Route path="/photos" element={<PhotosPage />} />
        <Route path="/arts" element={<div>Arts Page</div>} />
        
        {/* Scientific Articles */}
        <Route path={ROUTES.SCIENTIFIC_ARTICLES} element={<div>Scientific Articles</div>} />
        
        {/* Marketing Routes */}
        <Route path={ROUTES.MARKETING.CONSULTANT} element={<MarketingConsultant />} />
        <Route path={ROUTES.MARKETING.REPORTS} element={<div>Reports</div>} />
        
        {/* Consultant Routes */}
        <Route path={ROUTES.CONSULTANT.PANEL} element={<div>Consultant Panel</div>} />
        
        {/* Admin Routes */}
        <Route path={ROUTES.ADMIN.ROOT} element={<AdminDashboard />} />
        <Route path={ROUTES.ADMIN.EQUIPMENTS.ROOT} element={<AdminEquipments />} />
        <Route path={ROUTES.ADMIN.EQUIPMENTS.CREATE} element={<CreateEquipment />} />
        <Route path={ROUTES.ADMIN.EQUIPMENTS.EDIT(':id')} element={<EditEquipment />} />
        <Route path={ROUTES.ADMIN.CONTENT} element={<div>Admin Content</div>} />
        <Route path={ROUTES.ADMIN.AI} element={<div>Admin AI</div>} />
        <Route path={ROUTES.ADMIN.SYSTEM.DIAGNOSTICS} element={<div>System Diagnostics</div>} />
        <Route path={ROUTES.ADMIN.SYSTEM.INTELLIGENCE} element={<div>System Intelligence</div>} />
        <Route path={ROUTES.ADMIN.VIMEO.SETTINGS} element={<div>Vimeo Settings</div>} />
        <Route path={ROUTES.ADMIN.WORKSPACE} element={<div>Admin Workspace</div>} />
        <Route path={ROUTES.ADMIN_VIDEOS} element={<div>Admin Videos</div>} />
        
        {/* Workspace Settings */}
        <Route path={ROUTES.WORKSPACE_SETTINGS} element={<div>Workspace Settings</div>} />
        
        {/* Script Generator Route */}
        <Route path="/script-generator" element={<div>Script Generator</div>} />
        
        {/* 404 - Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
