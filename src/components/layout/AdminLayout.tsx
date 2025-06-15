
import React from 'react';
import AppLayout from './AppLayout';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  // Adicionando log para debug
  console.log('AdminLayout rendering');
  
  return (
    <AppLayout requireAdmin={true}>
      <div className="admin-container">
        {children}
      </div>
    </AppLayout>
  );
};

export default AdminLayout;
