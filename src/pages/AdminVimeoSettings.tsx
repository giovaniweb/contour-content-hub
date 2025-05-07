
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import VimeoAccountManager from '@/components/vimeo/VimeoAccountManager';
import VimeoSetupInstructions from '@/components/vimeo/VimeoSetupInstructions';
import { usePermissions } from '@/hooks/use-permissions';
import { Navigate } from 'react-router-dom';

const AdminVimeoSettings: React.FC = () => {
  const { isAdmin } = usePermissions();
  const [showSetupInstructions, setShowSetupInstructions] = useState(true);
  
  // If not admin, redirect to dashboard
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-contourline-darkBlue">Configuração do Vimeo</h1>
        
        {showSetupInstructions && (
          <VimeoSetupInstructions />
        )}
        
        <VimeoAccountManager />
      </div>
    </Layout>
  );
};

export default AdminVimeoSettings;
