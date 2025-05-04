
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NotFound from './pages/NotFound';
import EquipmentDetailsPage from './pages/EquipmentDetailsPage';
import Dashboard from './pages/Dashboard';
import AdminEquipments from './pages/AdminEquipments';
import { Navbar } from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/equipments" element={<AdminEquipments />} />
        <Route path="/equipment-details/:id" element={<EquipmentDetailsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
