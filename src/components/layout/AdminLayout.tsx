
import React from 'react';
import AppLayout from './AppLayout';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <AppLayout requireAdmin={true}>
      {children}
    </AppLayout>
  );
};

export default AdminLayout;
