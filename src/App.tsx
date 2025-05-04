import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminPage from './pages/AdminPage';
import EquipmentsPage from './pages/EquipmentsPage';
import NewEquipmentPage from './pages/NewEquipmentPage';
import EditEquipmentPage from './pages/EditEquipmentPage';
import ContentPage from './pages/ContentPage';
import CustomGPTPage from './pages/CustomGPTPage';
import EquipmentDetails from './pages/EquipmentDetails';
import EquipmentDetailsPage from './pages/EquipmentDetailsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/equipments" element={<EquipmentsPage />} />
        <Route path="/admin/equipments/new" element={<NewEquipmentPage />} />
        <Route path="/admin/equipments/edit/:id" element={<EditEquipmentPage />} />
        <Route path="/admin/content" element={<ContentPage />} />
        <Route path="/custom-gpt" element={<CustomGPTPage />} />
		<Route path="/equipments" element={<EquipmentsPage />} />
		<Route path="/equipment-details/:id" element={<EquipmentDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
