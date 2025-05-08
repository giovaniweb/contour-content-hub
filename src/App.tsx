
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ContentPlannerPage from "./pages/ContentPlannerPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Private Routes */}
        <Route path="/" element={<PrivateRoute><ContentPlannerPage /></PrivateRoute>} />
        <Route path="/content-planner" element={<PrivateRoute><ContentPlannerPage /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
