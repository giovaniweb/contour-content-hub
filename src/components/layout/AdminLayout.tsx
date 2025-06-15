
import React from 'react';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  // Adicionando log para debug
  console.log('AdminLayout rendering');

  return (
    <div className="min-h-screen flex w-full">
      <AdminSidebar />
      <main className="flex-1 min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
