
import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <Layout title="Dashboard">
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">
          Bem-vindo, {user?.name || 'Usuário'}!
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dashboard content */}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
