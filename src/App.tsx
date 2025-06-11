import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useAuth } from '@clerk/clerk-react';
import { useDispatch } from 'react-redux';
import { fetchUser } from './store/userSlice';
import './App.css';
import './styles/aurora-design-system.css';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminEquipments from './pages/AdminEquipments';
import EquipmentDetail from './pages/EquipmentDetail';
import NotFound from './pages/NotFound';
import AccessDenied from './pages/AccessDenied';
import Loading from './pages/Loading';
import ComingSoon from './pages/ComingSoon';
import CreateEquipment from '@/pages/admin/CreateEquipment';
import EditEquipment from '@/pages/admin/EditEquipment';

// Define a type for the admin route check
type AdminRouteProps = {
  children: React.ReactNode;
};

// AdminRoute component to protect admin-only routes
const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSignedIn && user) {
      dispatch(fetchUser(user.id));
    }
  }, [dispatch, isSignedIn, user]);

  if (!isLoaded) {
    return <Loading />;
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // Check if the user has a role and if it includes 'admin'
  if (user && user.publicMetadata && typeof user.publicMetadata.role === 'string' && user.publicMetadata.role.includes('admin')) {
    return <>{children}</>;
  } else if (user && Array.isArray(user.publicMetadata.role) && user.publicMetadata.role.includes('admin')) {
    return <>{children}</>;
  } else {
    return <Navigate to="/access-denied" replace />;
  }
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/equipments/:id" element={<EquipmentDetail />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/coming-soon" element={<ComingSoon />} />

        {/* Admin Routes */}
        <Route path="/admin/equipments" element={<AdminRoute><AdminEquipments /></AdminRoute>} />
        <Route path="/admin/equipments/create" element={<AdminRoute><CreateEquipment /></AdminRoute>} />
        <Route path="/admin/equipments/edit/:id" element={<AdminRoute><EditEquipment /></AdminRoute>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
